const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/replace\(\/\[':\r?\n\r\]\/g/g, "replace(/[':\\n\\r]/g");
code = code.replace(/replace\(\/\[':\r?\n\\r\]\/g/g, "replace(/[':\\n\\r]/g");
code = code.replace(/replace\(\/\[':\r?\n/g, "replace(/[':\\n\\r]/g");
fs.writeFileSync('server.ts', code);
