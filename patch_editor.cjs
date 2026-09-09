const fs = require('fs');
let content = fs.readFileSync('src/components/ShortsEditor.tsx', 'utf8');

content = content.replace(
  "bottom-[2%]",
  "bottom-[1%]"
);

content = content.replace(
  "clamp(0.875rem, 2.5vh, 1.5rem)",
  "clamp(0.6rem, 1.8vh, 1.2rem)"
);

fs.writeFileSync('src/components/ShortsEditor.tsx', content);
