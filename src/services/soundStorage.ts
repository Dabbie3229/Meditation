/**
 * IndexedDB storage for custom user-uploaded meditation audio tracks.
 * Allows users to upload MP3, WAV, M4A, or AAC files (e.g. from YouTube Audio Library
 * or royalty-free meditation sites) and use them permanently in the app.
 */

export interface CustomUploadedSound {
  id: string;
  name: string;
  blob: Blob;
  durationSeconds: number;
  fileSize: number;
  fileType: string;
  createdAt: number;
}

const DB_NAME = 'meditate_custom_sounds_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_sounds';

class SoundStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
          reject(new Error('IndexedDB not supported'));
          return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return this.dbPromise;
  }

  public async saveSound(file: File, customName?: string): Promise<CustomUploadedSound> {
    const db = await this.getDB();
    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanName = (customName || file.name.replace(/\.[^/.]+$/, '')).trim();

    // Determine audio duration via Audio element
    const duration = await this.detectAudioDuration(file);

    const record: CustomUploadedSound = {
      id,
      name: cleanName || 'My Meditation Track',
      blob: file,
      durationSeconds: duration,
      fileSize: file.size,
      fileType: file.type || 'audio/mpeg',
      createdAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  public async getAllSounds(): Promise<CustomUploadedSound[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const sounds = (req.result || []) as CustomUploadedSound[];
          // Sort newest first
          sounds.sort((a, b) => b.createdAt - a.createdAt);
          resolve(sounds);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to get custom sounds from IndexedDB:', err);
      return [];
    }
  }

  public async getSound(id: string): Promise<CustomUploadedSound | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => resolve((req.result as CustomUploadedSound) || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }

  public async deleteSound(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private detectAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.src = url;

      const cleanup = () => {
        URL.revokeObjectURL(url);
      };

      audio.onloadedmetadata = () => {
        const dur = Math.round(audio.duration || 0);
        cleanup();
        resolve(dur);
      };

      audio.onerror = () => {
        cleanup();
        resolve(0);
      };

      // Fallback timeout in case metadata event hangs
      setTimeout(() => {
        cleanup();
        resolve(0);
      }, 3000);
    });
  }
}

export const soundStorage = new SoundStorageService();
