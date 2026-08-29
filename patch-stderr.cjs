const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /job\.error = err\.message;/g,
  "job.error = err.message + '\\n' + stderr;"
);

code = code.replace(
  /y=\(h\/3\.5\)/g,
  "y=(h/4)"
);

fs.writeFileSync('server.ts', code);
