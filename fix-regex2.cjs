const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/const escapedTitle = customTitle\.replace.*/g, 'const escapedTitle = customTitle.replace(/[\\\'\\:\\n\\r]/g, "");');
code = code.replace(/const escapedSub = subtitle\.replace.*/g, 'const escapedSub = subtitle.replace(/[\\\'\\:\\n\\r]/g, "");');
fs.writeFileSync('server.ts', code);
