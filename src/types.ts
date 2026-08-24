export interface Clip {
  id: string;
  title: string;
  viralityScore: number;
  startTime: number;
  endTime: number;
  duration: number;
  transcript: string;
  thumbnailUrl?: string;
}

export interface VideoState {
  url: string | null;
  file: File | null;
  status: 'idle' | 'uploading' | 'analyzing' | 'ready';
  clips: Clip[];
}

export interface EditorSettings {
  aspectRatio: '9:16' | '1:1' | '16:9';
  subtitleStyle: 'hormozi' | 'minimal' | 'neon' | 'karaoke';
  showProgressBar: boolean;
  showWaveform: boolean;
  showTitleSticker: boolean;
  customTitle: string;
}

export interface RenderJob {
  id: string;
  clipId: string;
  title: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  progress: number;
  blobUrl?: string;
}
