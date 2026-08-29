const fs = require('fs');
let code = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

code = code.replace(
  /\{status === 'uploading' \? \(\s*<div className="relative flex items-center justify-center w-24 h-24 mb-2">/,
  `{status === 'uploading' ? (
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-24 h-24 mb-2">`
);

code = code.replace(
  /Speed: \{uploadSpeed\.toFixed\(1\)\} Mbps\s*<\/div>\s*\)\}\s*\) : \(/,
  `Speed: {uploadSpeed.toFixed(1)} Mbps
                  </div>
                )}
                </div>
              ) : (`
);

fs.writeFileSync('src/components/VideoUploader.tsx', code);
