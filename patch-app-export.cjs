const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleExport = async \(\) => \{[\s\S]*?await processRenderJob\(selectedClip\);\n  \};/,
  `const handleExport = async () => {
    const selectedClip = videoState.clips.find(c => c.id === selectedClipId);
    if (!selectedClip || !videoState.url) return;
    
    handleTabChange('export');
    await processRenderJob(selectedClip);
  };`
);

code = code.replace(
  /const handleExportAll = async \(\) => \{[\s\S]*?for \(const clip of videoState\.clips\) \{/,
  `const handleExportAll = async () => {
    if (!videoState.url || videoState.clips.length === 0) return;
    
    handleTabChange('export');
    
    // Process sequentially to save memory
    for (const clip of videoState.clips) {`
);

fs.writeFileSync('src/App.tsx', code);
