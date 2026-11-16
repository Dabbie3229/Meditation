import { useState, useRef, useEffect, useCallback } from 'react';

interface UseAudioTranscriberOptions {
  contextHint?: string;
  onTranscript: (text: string) => void;
}

function pickSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return 'audio/webm';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'audio/webm';
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Failed to read recorded audio.'));
    reader.readAsDataURL(blob);
  });
}

export function useAudioTranscriber({ contextHint, onTranscript }: UseAudioTranscriberOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const stopStream = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      stopStream();
    };
  }, [stopStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const finalMime = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, { type: finalMime });
        chunksRef.current = [];
        stopStream();
        setIsRecording(false);

        if (audioBlob.size < 400) {
          setError('Recording was too short. Please hold or speak a little longer.');
          return;
        }

        setIsTranscribing(true);
        try {
          const audioBase64 = await blobToBase64(audioBlob);
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64,
              mimeType: finalMime,
              contextHint,
            }),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data?.error || 'Could not transcribe audio.');
          }

          if (data?.transcript) {
            onTranscriptRef.current(String(data.transcript));
          } else {
            throw new Error('No speech could be transcribed.');
          }
        } catch (err: any) {
          setError(err?.message || 'Failed to transcribe recording.');
        } finally {
          setIsTranscribing(false);
          setRecordingSeconds(0);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= 59) {
            stopRecording();
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err: any) {
      stopStream();
      setIsRecording(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please allow microphone access to dictate audio.');
      } else {
        setError(err?.message || 'Unable to access microphone.');
      }
    }
  }, [contextHint, stopRecording, stopStream]);

  const toggleRecording = useCallback(() => {
    if (isTranscribing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, isTranscribing, startRecording, stopRecording]);

  return {
    isRecording,
    isTranscribing,
    recordingSeconds,
    error,
    clearError: () => setError(null),
    toggleRecording,
    stopRecording,
  };
}
