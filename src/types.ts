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
  videoId?: string;
  uploadProgress?: number;
  uploadSpeed?: number; // in MB/s
  url: string | null;
  file: File | null;
  status: 'idle' | 'uploading' | 'analyzing' | 'ready' | 'error';
  errorMessage?: string;
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
  errorMessage?: string;
  progress: number;
  blobUrl?: string;
  thumbnailUrl?: string;
  startTime?: number;
  duration?: number;
}
