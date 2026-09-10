const fs = require('fs');
let htmlContent = fs.readFileSync('index.html', 'utf8');

const newDesc = "Turn YouTube videos, podcasts, and long forms into viral TikToks, Instagram Reels, and YouTube Shorts instantly. 100% Free, Auto Subtitles.";

// Update all description meta tags to use the first one
htmlContent = htmlContent.replace(/<meta name="description" content=".*" \/>/, `<meta name="description" content="${newDesc}" />`);
htmlContent = htmlContent.replace(/<meta property="og:description" content=".*" \/>/, `<meta property="og:description" content="${newDesc}" />`);
htmlContent = htmlContent.replace(/<meta property="twitter:description" content=".*" \/>/, `<meta property="twitter:description" content="${newDesc}" />`);

fs.writeFileSync('index.html', htmlContent);
console.log("Description updated to option 1 across all tags.");
