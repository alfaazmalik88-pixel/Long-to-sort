const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /\} else \{ throw new Error\(`Missing chunk \$\{i\}`\); \} else \{/g,
  `} else {`
);

fs.writeFileSync('server.ts', code);
