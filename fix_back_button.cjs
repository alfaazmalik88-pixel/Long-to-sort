const fs = require('fs');
let content = fs.readFileSync('src/components/DownloadModal.tsx', 'utf8');

// Ensure ArrowLeft is imported
if (!content.includes('ArrowLeft')) {
  content = content.replace('X, ShieldCheck, Download, Clock', 'X, ArrowLeft, ShieldCheck, Download, Clock');
}

// Add history API logic to intercept Android back button
const historyEffect = `
  useEffect(() => {
    if (isOpen) {
      // Push a dummy state to history so we can intercept the back button
      window.history.pushState({ modalOpen: true }, '');
      
      const handlePopState = () => {
        // When system back is pressed, close the modal instead of exiting the app
        onClose();
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, onClose]);

  const handleManualClose = () => {
    // If user clicks our visual back button, we go back in history which triggers the popstate above
    window.history.back();
  };
`;

// Insert the history effect right after the existing useEffect
content = content.replace('}, [isOpen, step, countdown]);', '}, [isOpen, step, countdown]);\n' + historyEffect);

// Add the visual back button to the navbar
const visualBackButton = `
        <button onClick={handleManualClose} className="text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full flex items-center gap-2 pr-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
`;
content = content.replace('{/* Close button removed as requested */}', visualBackButton);

fs.writeFileSync('src/components/DownloadModal.tsx', content);
console.log("Back button logic added to DownloadModal.");
