const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(file\) \{\s*blobToUpload = file;\s*\}/,
  `if (file) {
          if (file.size > 1000 * 1024 * 1024) {
            throw new Error("File is too large. Please select a video smaller than 1GB.");
          }
          blobToUpload = file;
        }`
);

fs.writeFileSync('src/App.tsx', code);
