const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change concurrency from 2 to 1
code = code.replace(
  /const concurrency = 2;/g,
  "const concurrency = 1;"
);

// Better error logging
code = code.replace(
  /throw new Error\(\`Status \$\{res\.status\}\`\);/g,
  "throw new Error(`Status ${res.status}: ` + await res.text());"
);

// Better user alert
code = code.replace(
  /alert\('Error analyzing video: ' \+ \(error as Error\)\.message\);/g,
  "alert('Error uploading/analyzing: ' + (error.message || String(error)));"
);

fs.writeFileSync('src/App.tsx', code);
