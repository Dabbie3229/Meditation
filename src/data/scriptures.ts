import { CategoryItem, MoodConfig, Verse } from '../types';

export const TODAY_VERSE: Verse = {
  id: 'psalm-46-10',
  reference: 'Psalm 46:10',
  quote: 'Be still, and know that I am God.',
  book: 'Psalms',
  chapter: 46,
  verse: 10,
  category: 'Peace',
  reflectionPrompts: [
    'What does this reveal about God’s character?',
    'How does this apply to your situation today?',
    'What worry or striving can you release into His hands right now?'
  ],
  themeImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
};

export const MOODS: MoodConfig[] = [
  {
    id: 'Peace',
    label: 'Peace',
    iconName: 'dove',
    color: 'text-sky-500',
    bgActive: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300',
    verseReference: 'Psalm 46:10'
  },
  {
    id: 'Joy',
    label: 'Joy',
    iconName: 'smile',
    color: 'text-amber-500',
    bgActive: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300',
    verseReference: 'Nehemiah 8:10'
  },
  {
    id: 'Courage',
    label: 'Courage',
    iconName: 'shield',
    color: 'text-teal-600',
    bgActive: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300',
    verseReference: 'Joshua 1:9'
  },
  {
    id: 'Healing',
    label: 'Healing',
    iconName: 'leaf',
    color: 'text-emerald-500',
    bgActive: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
    verseReference: 'Jeremiah 17:14'
  },
  {
    id: 'Gratitude',
    label: 'Gratitude',
    iconName: 'heart',
    color: 'text-rose-500',
    bgActive: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300',
    verseReference: '1 Thessalonians 5:18'
  }
];

export const MOOD_SCRIPTURES: Record<string, Verse[]> = {
  Peace: [
    {
      id: 'psalm-46-10',
      reference: 'Psalm 46:10',
      quote: 'Be still, and know that I am God.',
      book: 'Psalms',
      chapter: 46,
      verse: 10,
      category: 'Peace',
      reflectionPrompts: [
        'What does this reveal about God’s character?',
        'How does this apply to your situation today?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'john-14-27',
      reference: 'John 14:27',
      quote: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
      book: 'John',
      chapter: 14,
      verse: 27,
      category: 'Peace',
      reflectionPrompts: [
        'How is Christ’s peace different from worldly comfort?',
        'What fear can you hand over to Jesus right now?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'phil-4-6-7',
      reference: 'Philippians 4:6-7',
      quote: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God will guard your hearts and your minds in Christ Jesus.',
      book: 'Philippians',
      chapter: 4,
      verse: 6,
      category: 'Peace',
      reflectionPrompts: [
        'What worries can you turn into prayers today?',
        'Visualize God’s supernatural peace guarding your heart like a fortress.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'isa-26-3',
      reference: 'Isaiah 26:3',
      quote: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.',
      book: 'Isaiah',
      chapter: 26,
      verse: 3,
      category: 'Peace',
      reflectionPrompts: [
        'Where has your focus wandered away from God’s faithfulness?',
        'Rest your thoughts intentionally upon His goodness.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    }
  ],
  Joy: [
    {
      id: 'neh-8-10',
      reference: 'Nehemiah 8:10',
      quote: 'Do not grieve, for the joy of the Lord is your strength.',
      book: 'Nehemiah',
      chapter: 8,
      verse: 10,
      category: 'Joy',
      reflectionPrompts: [
        'How does God’s joy become an inner well of strength in hard times?',
        'Rejoice in the Lord’s unwavering delight over you.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'psalm-16-11',
      reference: 'Psalm 16:11',
      quote: 'You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.',
      book: 'Psalms',
      chapter: 16,
      verse: 11,
      category: 'Joy',
      reflectionPrompts: [
        'What brings you the deepest joy in God’s presence?',
        'Ask the Holy Spirit to overflow your heart with holy gladness.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'rom-15-13',
      reference: 'Romans 15:13',
      quote: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
      book: 'Romans',
      chapter: 15,
      verse: 13,
      category: 'Joy',
      reflectionPrompts: [
        'In what area of your life do you need a fresh overflow of hope?',
        'Trust in Him today and let His joy renew your spirit.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1000&q=80',
    }
  ],
  Courage: [
    {
      id: 'josh-1-9',
      reference: 'Joshua 1:9',
      quote: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
      book: 'Joshua',
      chapter: 1,
      verse: 9,
      category: 'Courage',
      reflectionPrompts: [
        'What challenge requires holy boldness today?',
        'Remember that the God of angel armies walks with you.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'psalm-27-1',
      reference: 'Psalm 27:1',
      quote: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?',
      book: 'Psalms',
      chapter: 27,
      verse: 1,
      category: 'Courage',
      reflectionPrompts: [
        'What intimidates or worries you today?',
        'Declare the Lord as your fortress and unshakable light.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: '2tim-1-7',
      reference: '2 Timothy 1:7',
      quote: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.',
      book: '2 Timothy',
      chapter: 1,
      verse: 7,
      category: 'Courage',
      reflectionPrompts: [
        'Whenever fear knocks, how can you step into God’s love and power?',
        'Speak clarity and truth over confusion or hesitation.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80',
    }
  ],
  Healing: [
    {
      id: 'jer-17-14',
      reference: 'Jeremiah 17:14',
      quote: 'Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.',
      book: 'Jeremiah',
      chapter: 17,
      verse: 14,
      category: 'Healing',
      reflectionPrompts: [
        'Where in your heart or body are you asking for the Lord’s restoration?',
        'How can praise become your pathway to healing today?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'psalm-103-2-3',
      reference: 'Psalm 103:2-3',
      quote: 'Praise the Lord, my soul, and forget not all his benefits—who forgives all your sins and heals all your diseases.',
      book: 'Psalms',
      chapter: 103,
      verse: 2,
      category: 'Healing',
      reflectionPrompts: [
        'Count three benefits of God’s redemptive love in your life.',
        'Allow His restoring touch to wash over you in quiet prayer.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'isa-53-5',
      reference: 'Isaiah 53:5',
      quote: 'He was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
      book: 'Isaiah',
      chapter: 53,
      verse: 5,
      category: 'Healing',
      reflectionPrompts: [
        'Meditate on the depth of Christ’s sacrifice for your wholeness.',
        'Receive the healing and spiritual peace purchased for you at the cross.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    }
  ],
  Gratitude: [
    {
      id: '1thess-5-16-18',
      reference: '1 Thessalonians 5:16-18',
      quote: 'Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.',
      book: '1 Thessalonians',
      chapter: 5,
      verse: 16,
      category: 'Gratitude',
      reflectionPrompts: [
        'What is one circumstance today where you can offer intentional thanks?',
        'How does gratitude transform your perspective on current struggles?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'psalm-100-4',
      reference: 'Psalm 100:4',
      quote: 'Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.',
      book: 'Psalms',
      chapter: 100,
      verse: 4,
      category: 'Gratitude',
      reflectionPrompts: [
        'Begin your meditation by thanking God for five specific blessings.',
        'Feel your heart open in worship as you recognize His goodness.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'psalm-107-1',
      reference: 'Psalm 107:1',
      quote: 'Give thanks to the Lord, for he is good; his love endures forever.',
      book: 'Psalms',
      chapter: 107,
      verse: 1,
      category: 'Gratitude',
      reflectionPrompts: [
        'His steadfast love never fails. Let that truth anchor your soul.',
        'Praise Him simply for who He is.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    }
  ]
};


export const CATEGORIES: CategoryItem[] = [
  {
    id: 'faith',
    title: 'Faith',
    subtitle: 'Explore verses',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-700/80 via-orange-800/70 to-slate-900/90',
    verseCount: 18
  },
  {
    id: 'healing',
    title: 'Healing',
    subtitle: 'Find peace',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-800/80 via-teal-900/70 to-slate-900/90',
    verseCount: 14
  },
  {
    id: 'finances',
    title: 'Finances',
    subtitle: 'Trust God',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-yellow-800/80 via-amber-900/70 to-slate-900/90',
    verseCount: 12
  },
  {
    id: 'wisdom',
    title: 'Wisdom',
    subtitle: 'Seek guidance',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-stone-800/80 via-amber-950/70 to-slate-900/90',
    verseCount: 22
  },
  {
    id: 'forgiveness',
    title: 'Forgiveness',
    subtitle: 'Let go',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-800/80 via-teal-900/70 to-emerald-950/90',
    verseCount: 10
  },
  {
    id: 'strength',
    title: 'Strength',
    subtitle: 'Be strong',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-green-900/80 via-emerald-900/70 to-teal-950/90',
    verseCount: 16
  },
  {
    id: 'closeness',
    title: 'Closeness with God',
    subtitle: 'Draw near',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-900/80 via-green-950/70 to-emerald-950/90',
    verseCount: 15
  },
  {
    id: 'praise',
    title: 'Praise',
    subtitle: 'Celebrate Him',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-800/80 via-teal-900/70 to-emerald-950/90',
    verseCount: 20
  }
];

export const SCRIPTURE_COLLECTION: Record<string, Verse[]> = {
  faith: [
    {
      id: 'heb-11-1',
      reference: 'Hebrews 11:1',
      quote: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
      book: 'Hebrews',
      chapter: 11,
      verse: 1,
      category: 'Faith',
      reflectionPrompts: [
        'What unseen promise of God are you holding onto today?',
        'How does trusting God grant you peace in times of uncertainty?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'prov-3-5',
      reference: 'Proverbs 3:5-6',
      quote: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
      book: 'Proverbs',
      chapter: 3,
      verse: 5,
      category: 'Faith',
      reflectionPrompts: [
        'Where are you currently relying on your own understanding?',
        'What step of surrender is the Spirit inviting you to take?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    }
  ],
  healing: [
    {
      id: 'jer-17-14',
      reference: 'Jeremiah 17:14',
      quote: 'Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.',
      book: 'Jeremiah',
      chapter: 17,
      verse: 14,
      category: 'Healing',
      reflectionPrompts: [
        'Where in your heart or body are you asking for the Lord’s restoration?',
        'How can praise become your pathway to healing today?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'matt-11-28',
      reference: 'Matthew 11:28',
      quote: 'Come to me, all you who are weary and burdened, and I will give you rest.',
      book: 'Matthew',
      chapter: 11,
      verse: 28,
      category: 'Healing',
      reflectionPrompts: [
        'What heaviness or fatigue can you lay at Jesus’ feet right now?',
        'Breathe deeply and receive the rest only Christ provides.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    }
  ],
  finances: [
    {
      id: 'phil-4-19',
      reference: 'Philippians 4:19',
      quote: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
      book: 'Philippians',
      chapter: 4,
      verse: 19,
      category: 'Finances',
      reflectionPrompts: [
        'How has God proven faithful in providing for you in the past?',
        'Release any scarcity mindset and thank Him for His abundant care.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80'
    }
  ],
  wisdom: [
    {
      id: 'james-1-5',
      reference: 'James 1:5',
      quote: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',
      book: 'James',
      chapter: 1,
      verse: 5,
      category: 'Wisdom',
      reflectionPrompts: [
        'What major decision or situation are you facing that needs heavenly wisdom?',
        'Ask with confidence, knowing God gives generously.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80'
    }
  ],
  forgiveness: [
    {
      id: 'eph-4-32',
      reference: 'Ephesians 4:32',
      quote: 'Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.',
      book: 'Ephesians',
      chapter: 4,
      verse: 32,
      category: 'Forgiveness',
      reflectionPrompts: [
        'Is there someone you need to extend grace or forgiveness toward today?',
        'Reflect on how deeply you have been forgiven in Christ.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80'
    }
  ],
  strength: [
    {
      id: 'isa-40-31',
      reference: 'Isaiah 40:31',
      quote: 'Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
      book: 'Isaiah',
      chapter: 40,
      verse: 31,
      category: 'Strength',
      reflectionPrompts: [
        'In what areas are you feeling depleted today?',
        'Wait on the Lord in silence and let Him renew your inner strength.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    }
  ],
  closeness: [
    {
      id: 'james-4-8',
      reference: 'James 4:8',
      quote: 'Come near to God and he will come near to you.',
      book: 'James',
      chapter: 4,
      verse: 8,
      category: 'Closeness with God',
      reflectionPrompts: [
        'Take a quiet moment to simply be aware of God’s loving presence.',
        'What does drawing near look like in your routine this week?'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    }
  ],
  praise: [
    {
      id: 'psalm-150-6',
      reference: 'Psalm 150:6',
      quote: 'Let everything that has breath praise the Lord. Praise the Lord.',
      book: 'Psalms',
      chapter: 150,
      verse: 6,
      category: 'Praise',
      reflectionPrompts: [
        'Take three conscious breaths and let each exhale be a prayer of praise.',
        'List three blessings you are praising God for right now.'
      ],
      themeImageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80'
    }
  ]
};
