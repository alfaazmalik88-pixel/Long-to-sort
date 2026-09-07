import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { DownloadModal } from './DownloadModal';

export const DownloadButton = ({ url, title }: { url: string, title: string }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
      
      <DownloadModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        downloadUrl={url} 
        fileName={title} 
      />
    </>
  );
};
