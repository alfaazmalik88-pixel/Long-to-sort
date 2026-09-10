const fs = require('fs');
let serverContent = fs.readFileSync('server.ts', 'utf8');

// Replace "};\n};\nasync function" with "};\nasync function"
serverContent = serverContent.replace(/\};\n\};\nasync function/g, '};\nasync function');

fs.writeFileSync('server.ts', serverContent);
