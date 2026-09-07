import React from 'react';

export const AdBanner = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center p-4 text-zinc-500 text-sm overflow-hidden ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-40">Advertisement</span>
      <div className="w-full h-[60px] md:h-[90px] bg-zinc-800/50 rounded-lg flex items-center justify-center border border-zinc-800/50">
         <span className="opacity-50">Ad Space</span>
      </div>
    </div>
  );
};
