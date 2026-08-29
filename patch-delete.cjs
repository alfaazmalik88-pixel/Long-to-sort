const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// We want to prevent deleting the videoPath in the render endpoint so subsequent clips can use it
code = code.replace(
  /if \(videoPath && fs\.existsSync\(videoPath\)\) \{\n\s*fs\.unlinkSync\(videoPath\);\n\s*\}/g,
  `if (videoPath && fs.existsSync(videoPath)) {
          // fs.unlinkSync(videoPath); // Do not delete so we can render multiple parts
        }`
);

fs.writeFileSync('server.ts', code);
