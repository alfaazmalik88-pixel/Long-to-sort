const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target = `    if (error) {
      return res.status(500).json({ error: 'Video processing failed.', details: stderr });
    }`;

const replacement = `    if (error) {
      try {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (e) {}
      return res.status(500).json({ error: 'Video processing failed.', details: stderr });
    }`;

content = content.replace(target, replacement);
fs.writeFileSync('server.ts', content);
console.log("Patched server.ts for cleanup");
