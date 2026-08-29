const fs = require('fs');
let code = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

code = code.replace(
    /<button \s*onClick=\{onTogglePause\} \s*className="([^"]+)"\s*>/g,
    `<button 
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePause(); }} 
    className="$1 relative z-10 pointer-events-auto cursor-pointer"
>`
);

fs.writeFileSync('src/components/VideoUploader.tsx', code);
console.log("Patched button events");
