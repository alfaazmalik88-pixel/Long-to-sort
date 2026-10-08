export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface SubtitleItem {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  words?: WordTimestamp[];
}

export interface Clip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  transcript?: string;
  viralityScore?: number;
  subtitles?: SubtitleItem[];
}

export interface EditorSettings {
  clipDuration: number;
  format: 'shorts' | 'square' | 'landscape';
  captionStyle: 'hormozi' | 'minimal' | 'transparent' | 'neon' | 'karaoke';
  captionPosition?: 'bottom' | 'lower' | 'middle'; // Default: 'bottom' (lower area, avoiding subject's face)
  videoFit?: 'contain' | 'cover'; // 'contain' (no crop, full video visible) vs 'cover' (fill 9:16)
  audioWaveform: boolean;
  titleSticker: boolean; // Part 1 series tag ON/OFF
  enableCaptions: boolean; // Generate Animated Captions ON/OFF (Default: ON)
  subtitleLanguage?: 'auto' | 'hi' | 'en' | 'es' | 'fr' | 'de' | 'ar' | 'ja' | 'ru' | 'pt' | string; // Language: Hindi -> Hinglish, others Global / Local
  exportQuality?: '480p' | '720p' | '1080p' | '4k'; 
  showTitleSticker?: boolean;
  customTitle?: string;
}

export interface RenderJob {
  id: string;
  clipId: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  progress: number;
  blobUrl?: string;
  title?: string;
  duration?: number; // Video duration in seconds
}

export interface VideoState {
  url: string | null;
  file: File | null;
  serverPath?: string | null;
  status: 'idle' | 'uploading' | 'analyzing' | 'ready' | 'error';
  clips: Clip[];
  isPaused?: boolean;
  is4K?: boolean;
}
