const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/main.tsx', 'utf8');
content = `import { BrowserRouter } from 'react-router-dom';\n` + content.replace('<App />', '<BrowserRouter><App /></BrowserRouter>');
fs.writeFileSync('/app/applet/src/main.tsx', content);
