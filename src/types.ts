export interface Clip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  transcript?: string;
  viralityScore?: number;
}

export interface EditorSettings {
  clipDuration: number;
  format: 'shorts' | 'square' | 'landscape';
  captionStyle: 'hormozi' | 'neon' | 'minimal' | 'karaoke';
  audioWaveform: boolean;
  titleSticker: boolean;
  exportQuality?: '480p' | '720p' | '1080p'; // Added back for compatibility
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
}

export interface VideoState {
  url: string | null;
  file: File | null;
  status: 'idle' | 'uploading' | 'analyzing' | 'ready' | 'error';
  clips: Clip[];
  isPaused?: boolean;
}
