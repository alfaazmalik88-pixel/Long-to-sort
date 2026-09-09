const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/App.tsx', 'utf8');

// Add Route imports
content = content.replace(
  "import { renderVideoClip } from './lib/renderVideo';",
  "import { renderVideoClip } from './lib/renderVideo';\nimport { Routes, Route } from 'react-router-dom';\nimport { PrivacyPolicy } from './pages/PrivacyPolicy';\nimport { TermsOfService } from './pages/TermsOfService';\nimport { Contact } from './pages/Contact';"
);

// We need to wrap the return value of App with Routes
const returnStart = content.indexOf('return (');
const returnEnd = content.lastIndexOf(');') + 2;

const mainEditorJsx = content.substring(returnStart + 8, returnEnd - 2);

const newReturn = `return (
    <Routes>
      <Route path="/" element={
        ${mainEditorJsx}
      } />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );`;

content = content.substring(0, returnStart) + newReturn + content.substring(returnEnd);

fs.writeFileSync('/app/applet/src/App.tsx', content);
