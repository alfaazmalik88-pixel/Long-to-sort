const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /\.outputOptions\('-preset', 'ultrafast'\)/g,
  ".outputOptions('-preset', 'fast')"
);

code = code.replace(
  /\.outputOptions\('-crf', '24'\)/g,
  ".outputOptions('-crf', '18') // High quality (visually lossless)"
);

fs.writeFileSync('server.ts', code);
