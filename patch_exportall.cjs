const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /for\s*\(\s*const\s+clip\s+of\s+videoState\.clips\s*\)\s*\{\s*await\s+processRenderJob\(clip\);\s*\}/;
const replacement = `for (let i = 0; i < videoState.clips.length; i++) {
      await processRenderJob(videoState.clips[i]);
    }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched handleExportAll");
