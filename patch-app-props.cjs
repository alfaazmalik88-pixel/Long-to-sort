const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /uploadSpeed=\{videoState\.uploadSpeed\}/,
  "uploadSpeed={videoState.uploadSpeed}\n                errorMessage={videoState.errorMessage}\n                onCancel={() => setVideoState({ url: null, file: null, status: 'idle', clips: [] })}"
);

// also fix the catch block in App.tsx
code = code.replace(
  /alert\('Error uploading\/analyzing: ' \+ \(error\.message \|\| String\(error\)\)\);\s*setVideoState\(prev => \(\{ \.\.\.prev, status: 'idle' \}\)\);/,
  `// alert('Error uploading/analyzing: ' + (error.message || String(error)));\n      setVideoState(prev => ({ ...prev, status: 'error', errorMessage: error.message || "Failed due to slow internet connection or server error." }));`
);

fs.writeFileSync('src/App.tsx', code);
