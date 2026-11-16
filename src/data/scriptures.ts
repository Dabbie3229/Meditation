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

export const EXTRA_SCRIPTURES: Verse[] = [
  {
    id: 'psalm-23-1-3',
    reference: 'Psalm 23:1-3',
    quote: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
    book: 'Psalms',
    chapter: 23,
    verse: 1,
    category: 'Peace',
    reflectionPrompts: [
      'Picture yourself resting beside still waters with the Good Shepherd.',
      'What area of your soul needs His gentle refreshment today?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'john-3-16',
    reference: 'John 3:16',
    quote: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    book: 'John',
    chapter: 3,
    verse: 16,
    category: 'Love',
    reflectionPrompts: [
      'Receive the depth of God’s personal love for you today.',
      'How does knowing you are deeply loved quiet your fears?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'romans-8-28',
    reference: 'Romans 8:28',
    quote: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    book: 'Romans',
    chapter: 8,
    verse: 28,
    category: 'Hope',
    reflectionPrompts: [
      'How does knowing God works all things for good comfort you today?',
      'What situation can you trust to His redeeming hands right now?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'phil-4-13',
    reference: 'Philippians 4:13',
    quote: 'I can do all this through him who gives me strength.',
    book: 'Philippians',
    chapter: 4,
    verse: 13,
    category: 'Strength',
    reflectionPrompts: [
      'Where do you feel your own strength running low today?',
      'Invite Christ’s sustaining power into the task ahead of you.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'jer-29-11',
    reference: 'Jeremiah 29:11',
    quote: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    book: 'Jeremiah',
    chapter: 29,
    verse: 11,
    category: 'Hope',
    reflectionPrompts: [
      'What uncertainty about the future can you surrender to God’s care?',
      'Rest in the assurance that God’s plans for you are filled with hope.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '1cor-13-4-7',
    reference: '1 Corinthians 13:4-7',
    quote: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. Love never fails.',
    book: '1 Corinthians',
    chapter: 13,
    verse: 4,
    category: 'Love',
    reflectionPrompts: [
      'Which quality of love—patience, kindness, or humility—is God inviting you into today?',
      'Reflect on how patiently and kindly God loves you.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'psalm-91-1-2',
    reference: 'Psalm 91:1-2',
    quote: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress, my God, in whom I trust.',
    book: 'Psalms',
    chapter: 91,
    verse: 1,
    category: 'Protection',
    reflectionPrompts: [
      'Breathe slowly and picture yourself safe within the shelter of the Most High.',
      'What anxious thoughts fade when you declare God as your refuge?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'psalm-121-1-2',
    reference: 'Psalm 121:1-2',
    quote: 'I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord, the Maker of heaven and earth.',
    book: 'Psalms',
    chapter: 121,
    verse: 1,
    category: 'Trust',
    reflectionPrompts: [
      'Lift your focus above today’s pressures to the Maker of heaven and earth.',
      'Where do you need God’s timely help right now?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'matt-6-33-34',
    reference: 'Matthew 6:33-34',
    quote: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well. Therefore do not worry about tomorrow, for tomorrow will worry about itself.',
    book: 'Matthew',
    chapter: 6,
    verse: 33,
    category: 'Peace',
    reflectionPrompts: [
      'What concern about tomorrow can you release so you can be present with God today?',
      'How can you seek His kingdom first in the next hour?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'psalm-139-14',
    reference: 'Psalm 139:14',
    quote: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',
    book: 'Psalms',
    chapter: 139,
    verse: 14,
    category: 'Praise',
    reflectionPrompts: [
      'Thank God for creating you with intention, purpose, and care.',
      'Let go of self-criticism and rest in how wonderfully He sees you.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'lam-3-22-23',
    reference: 'Lamentations 3:22-23',
    quote: 'Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.',
    book: 'Lamentations',
    chapter: 3,
    verse: 22,
    category: 'Grace',
    reflectionPrompts: [
      'Receive God’s fresh mercy prepared specifically for today.',
      'Where have you witnessed His steady faithfulness this week?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'rom-8-38-39',
    reference: 'Romans 8:38-39',
    quote: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, will be able to separate us from the love of God that is in Christ Jesus our Lord.',
    book: 'Romans',
    chapter: 8,
    verse: 38,
    category: 'Love',
    reflectionPrompts: [
      'Nothing can separate you from God’s love. Let that truth sink deeply into your heart.',
      'What fear loses its grip when you remember His unbreakable love?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2cor-12-9',
    reference: '2 Corinthians 12:9',
    quote: 'My grace is sufficient for you, for my power is made perfect in weakness.',
    book: '2 Corinthians',
    chapter: 12,
    verse: 9,
    category: 'Grace',
    reflectionPrompts: [
      'Where do you feel weak or inadequate today? Invite God’s grace right there.',
      'Thank Him that His strength shines brightest through gentle surrender.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'psalm-34-18',
    reference: 'Psalm 34:18',
    quote: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
    book: 'Psalms',
    chapter: 34,
    verse: 18,
    category: 'Comfort',
    reflectionPrompts: [
      'Bring any ache, grief, or heaviness honestly before the Lord.',
      'Feel His tender nearness comforting your spirit right now.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'isa-41-10',
    reference: 'Isaiah 41:10',
    quote: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    book: 'Isaiah',
    chapter: 41,
    verse: 10,
    category: 'Courage',
    reflectionPrompts: [
      'Hear God’s personal promise: "I am with you. I will help you."',
      'What weight can you let His righteous right hand uphold for you today?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'psalm-119-105',
    reference: 'Psalm 119:105',
    quote: 'Your word is a lamp for my feet, a light on my path.',
    book: 'Psalms',
    chapter: 119,
    verse: 105,
    category: 'Wisdom',
    reflectionPrompts: [
      'What next step in front of you needs God’s clear light today?',
      'Even one illuminated step at a time is enough when walking with Him.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '1pet-5-7',
    reference: '1 Peter 5:7',
    quote: 'Cast all your anxiety on him because he cares for you.',
    book: '1 Peter',
    chapter: 5,
    verse: 7,
    category: 'Peace',
    reflectionPrompts: [
      'Name one anxiety you are carrying and consciously place it into God’s care.',
      'Why is it comforting to remember that He personally cares for you?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'col-3-15',
    reference: 'Colossians 3:15',
    quote: 'Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.',
    book: 'Colossians',
    chapter: 3,
    verse: 15,
    category: 'Peace',
    reflectionPrompts: [
      'Invite Christ’s peace to act as the calming guide over your decisions today.',
      'Pair your prayer with quiet gratitude for His steady presence.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'john-15-5',
    reference: 'John 15:5',
    quote: 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.',
    book: 'John',
    chapter: 15,
    verse: 5,
    category: 'Closeness with God',
    reflectionPrompts: [
      'Pause striving and focus simply on abiding in Christ today.',
      'How does staying connected to the Vine nourish your spirit?'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'prov-16-3',
    reference: 'Proverbs 16:3',
    quote: 'Commit to the Lord whatever you do, and he will establish your plans.',
    book: 'Proverbs',
    chapter: 16,
    verse: 3,
    category: 'Guidance',
    reflectionPrompts: [
      'Commit today’s work, conversations, and decisions into the Lord’s hands.',
      'Trust Him to order your steps with quiet confidence.'
    ],
    themeImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80'
  }
];
