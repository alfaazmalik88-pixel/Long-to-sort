export interface SubtitleWord {
  word: string;
  start: number;
  end: number;
}

export interface SubtitleItem {
  id: string;
  startTime: number;
  endTime: number;
  start: number;
  end: number;
  text: string;
  words: SubtitleWord[];
}

export const DEMO_PRELOADED_SUBTITLES: Record<string, SubtitleItem[]> = {
  hi: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.4,
      start: 0.0,
      end: 2.4,
      text: "AAJ HUM KARENGE KUCH",
      words: [
        { word: "AAJ", start: 0.0, end: 0.6 },
        { word: "HUM", start: 0.6, end: 1.1 },
        { word: "KARENGE", start: 1.1, end: 1.8 },
        { word: "KUCH", start: 1.8, end: 2.4 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.4,
      endTime: 4.8,
      start: 2.4,
      end: 4.8,
      text: "NAYA VIRAL TRY",
      words: [
        { word: "NAYA", start: 2.4, end: 3.1 },
        { word: "VIRAL", start: 3.1, end: 3.9 },
        { word: "TRY", start: 3.9, end: 4.8 }
      ]
    },
    {
      id: "sub-3",
      startTime: 4.8,
      endTime: 7.2,
      start: 4.8,
      end: 7.2,
      text: "INSTAGRAM REELS MEIN",
      words: [
        { word: "INSTAGRAM", start: 4.8, end: 5.6 },
        { word: "REELS", start: 5.6, end: 6.4 },
        { word: "MEIN", start: 6.4, end: 7.2 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.2,
      endTime: 10.0,
      start: 7.2,
      end: 10.0,
      text: "KAISE GROW KAREIN",
      words: [
        { word: "KAISE", start: 7.2, end: 8.0 },
        { word: "GROW", start: 8.0, end: 9.0 },
        { word: "KAREIN", start: 9.0, end: 10.0 }
      ]
    }
  ],
  en: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.4,
      start: 0.0,
      end: 2.4,
      text: "TODAY WE WILL TRY",
      words: [
        { word: "TODAY", start: 0.0, end: 0.6 },
        { word: "WE", start: 0.6, end: 1.1 },
        { word: "WILL", start: 1.1, end: 1.7 },
        { word: "TRY", start: 1.7, end: 2.4 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.4,
      endTime: 4.8,
      start: 2.4,
      end: 4.8,
      text: "SOMETHING TOTALLY NEW",
      words: [
        { word: "SOMETHING", start: 2.4, end: 3.2 },
        { word: "TOTALLY", start: 3.2, end: 4.0 },
        { word: "NEW", start: 4.0, end: 4.8 }
      ]
    },
    {
      id: "sub-3",
      startTime: 4.8,
      endTime: 7.2,
      start: 4.8,
      end: 7.2,
      text: "HOW CREATORS GROW FAST",
      words: [
        { word: "HOW", start: 4.8, end: 5.3 },
        { word: "CREATORS", start: 5.3, end: 6.0 },
        { word: "GROW", start: 6.0, end: 6.6 },
        { word: "FAST", start: 6.6, end: 7.2 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.2,
      endTime: 10.0,
      start: 7.2,
      end: 10.0,
      text: "ON SOCIAL MEDIA",
      words: [
        { word: "ON", start: 7.2, end: 7.9 },
        { word: "SOCIAL", start: 7.9, end: 8.9 },
        { word: "MEDIA", start: 8.9, end: 10.0 }
      ]
    }
  ],
  es: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.5,
      start: 0.0,
      end: 2.5,
      text: "HOY VAMOS A PROBAR",
      words: [
        { word: "HOY", start: 0.0, end: 0.6 },
        { word: "VAMOS", start: 0.6, end: 1.2 },
        { word: "A", start: 1.2, end: 1.6 },
        { word: "PROBAR", start: 1.6, end: 2.5 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.5,
      endTime: 5.0,
      start: 2.5,
      end: 5.0,
      text: "ALGO TOTALMENTE NUEVO",
      words: [
        { word: "ALGO", start: 2.5, end: 3.2 },
        { word: "TOTALMENTE", start: 3.2, end: 4.1 },
        { word: "NUEVO", start: 4.1, end: 5.0 }
      ]
    },
    {
      id: "sub-3",
      startTime: 5.0,
      endTime: 7.5,
      start: 5.0,
      end: 7.5,
      text: "CÓMO CRECER RÁPIDO",
      words: [
        { word: "CÓMO", start: 5.0, end: 5.8 },
        { word: "CRECER", start: 5.8, end: 6.6 },
        { word: "RÁPIDO", start: 6.6, end: 7.5 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.5,
      endTime: 10.0,
      start: 7.5,
      end: 10.0,
      text: "EN TIKTOK Y REELS",
      words: [
        { word: "EN", start: 7.5, end: 8.1 },
        { word: "TIKTOK", start: 8.1, end: 8.9 },
        { word: "Y", start: 8.9, end: 9.3 },
        { word: "REELS", start: 9.3, end: 10.0 }
      ]
    }
  ],
  fr: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.5,
      start: 0.0,
      end: 2.5,
      text: "AUJOURD'HUI NOUS TESTONS",
      words: [
        { word: "AUJOURD'HUI", start: 0.0, end: 0.8 },
        { word: "NOUS", start: 0.8, end: 1.5 },
        { word: "TESTONS", start: 1.5, end: 2.5 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.5,
      endTime: 5.0,
      start: 2.5,
      end: 5.0,
      text: "QUELQUE CHOSE DE NOUVEAU",
      words: [
        { word: "QUELQUE", start: 2.5, end: 3.1 },
        { word: "CHOSE", start: 3.1, end: 3.8 },
        { word: "DE", start: 3.8, end: 4.2 },
        { word: "NOUVEAU", start: 4.2, end: 5.0 }
      ]
    },
    {
      id: "sub-3",
      startTime: 5.0,
      endTime: 7.5,
      start: 5.0,
      end: 7.5,
      text: "COMMENT DEVENIR VIRAL",
      words: [
        { word: "COMMENT", start: 5.0, end: 5.8 },
        { word: "DEVENIR", start: 5.8, end: 6.6 },
        { word: "VIRAL", start: 6.6, end: 7.5 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.5,
      endTime: 10.0,
      start: 7.5,
      end: 10.0,
      text: "SUR LES RÉSEAUX SOCIAUX",
      words: [
        { word: "SUR", start: 7.5, end: 8.2 },
        { word: "LES", start: 8.2, end: 8.9 },
        { word: "RÉSEAUX", start: 8.9, end: 9.5 },
        { word: "SOCIAUX", start: 9.5, end: 10.0 }
      ]
    }
  ],
  de: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.5,
      start: 0.0,
      end: 2.5,
      text: "HEUTE PROBIEREN WIR",
      words: [
        { word: "HEUTE", start: 0.0, end: 0.7 },
        { word: "PROBIEREN", start: 0.7, end: 1.7 },
        { word: "WIR", start: 1.7, end: 2.5 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.5,
      endTime: 5.0,
      start: 2.5,
      end: 5.0,
      text: "ETWAS GANZ NEUES",
      words: [
        { word: "ETWAS", start: 2.5, end: 3.3 },
        { word: "GANZ", start: 3.3, end: 4.1 },
        { word: "NEUES", start: 4.1, end: 5.0 }
      ]
    },
    {
      id: "sub-3",
      startTime: 5.0,
      endTime: 7.5,
      start: 5.0,
      end: 7.5,
      text: "WIE MAN SCHNELL WÄCHST",
      words: [
        { word: "WIE", start: 5.0, end: 5.5 },
        { word: "MAN", start: 5.5, end: 6.0 },
        { word: "SCHNELL", start: 6.0, end: 6.7 },
        { word: "WÄCHST", start: 6.7, end: 7.5 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.5,
      endTime: 10.0,
      start: 7.5,
      end: 10.0,
      text: "AUF SOCIAL MEDIA",
      words: [
        { word: "AUF", start: 7.5, end: 8.1 },
        { word: "SOCIAL", start: 8.1, end: 9.0 },
        { word: "MEDIA", start: 9.0, end: 10.0 }
      ]
    }
  ],
  ar: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.5,
      start: 0.0,
      end: 2.5,
      text: "اليوم سوف نجرب",
      words: [
        { word: "اليوم", start: 0.0, end: 0.8 },
        { word: "سوف", start: 0.8, end: 1.6 },
        { word: "نجرب", start: 1.6, end: 2.5 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.5,
      endTime: 5.0,
      start: 2.5,
      end: 5.0,
      text: "شيئا جديدا تماما",
      words: [
        { word: "شيئا", start: 2.5, end: 3.3 },
        { word: "جديدا", start: 3.3, end: 4.1 },
        { word: "تماما", start: 4.1, end: 5.0 }
      ]
    },
    {
      id: "sub-3",
      startTime: 5.0,
      endTime: 7.5,
      start: 5.0,
      end: 7.5,
      text: "كيف تصبح مشهورا",
      words: [
        { word: "كيف", start: 5.0, end: 5.7 },
        { word: "تصبح", start: 5.7, end: 6.5 },
        { word: "مشهورا", start: 6.5, end: 7.5 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.5,
      endTime: 10.0,
      start: 7.5,
      end: 10.0,
      text: "على منصات التواصل",
      words: [
        { word: "على", start: 7.5, end: 8.2 },
        { word: "منصات", start: 8.2, end: 9.1 },
        { word: "التواصل", start: 9.1, end: 10.0 }
      ]
    }
  ],
  ja: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.5,
      start: 0.0,
      end: 2.5,
      text: "今日は新しいことに",
      words: [
        { word: "今日は", start: 0.0, end: 0.8 },
        { word: "新しい", start: 0.8, end: 1.6 },
        { word: "ことに", start: 1.6, end: 2.5 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.5,
      endTime: 5.0,
      start: 2.5,
      end: 5.0,
      text: "挑戦してみましょう",
      words: [
        { word: "挑戦", start: 2.5, end: 3.3 },
        { word: "して", start: 3.3, end: 4.1 },
        { word: "みましょう", start: 4.1, end: 5.0 }
      ]
    },
    {
      id: "sub-3",
      startTime: 5.0,
      endTime: 7.5,
      start: 5.0,
      end: 7.5,
      text: "SNSでバズる",
      words: [
        { word: "SNSで", start: 5.0, end: 6.0 },
        { word: "バズる", start: 6.0, end: 7.5 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.5,
      endTime: 10.0,
      start: 7.5,
      end: 10.0,
      text: "クリエイターの秘密",
      words: [
        { word: "クリエイターの", start: 7.5, end: 8.8 },
        { word: "秘密", start: 8.8, end: 10.0 }
      ]
    }
  ],
  pt: [
    {
      id: "sub-1",
      startTime: 0.0,
      endTime: 2.5,
      start: 0.0,
      end: 2.5,
      text: "HOJE VAMOS TENTAR",
      words: [
        { word: "HOJE", start: 0.0, end: 0.6 },
        { word: "VAMOS", start: 0.6, end: 1.4 },
        { word: "TENTAR", start: 1.4, end: 2.5 }
      ]
    },
    {
      id: "sub-2",
      startTime: 2.5,
      endTime: 5.0,
      start: 2.5,
      end: 5.0,
      text: "ALGO TOTALMENTE NOVO",
      words: [
        { word: "ALGO", start: 2.5, end: 3.2 },
        { word: "TOTALMENTE", start: 3.2, end: 4.1 },
        { word: "NOVO", start: 4.1, end: 5.0 }
      ]
    },
    {
      id: "sub-3",
      startTime: 5.0,
      endTime: 7.5,
      start: 5.0,
      end: 7.5,
      text: "COMO CRESCER RÁPIDO",
      words: [
        { word: "COMO", start: 5.0, end: 5.7 },
        { word: "CRESCER", start: 5.7, end: 6.6 },
        { word: "RÁPIDO", start: 6.6, end: 7.5 }
      ]
    },
    {
      id: "sub-4",
      startTime: 7.5,
      endTime: 10.0,
      start: 7.5,
      end: 10.0,
      text: "NO INSTAGRAM E TIKTOK",
      words: [
        { word: "NO", start: 7.5, end: 8.0 },
        { word: "INSTAGRAM", start: 8.0, end: 8.9 },
        { word: "E", start: 8.9, end: 9.3 },
        { word: "TIKTOK", start: 9.3, end: 10.0 }
      ]
    }
  ]
};
