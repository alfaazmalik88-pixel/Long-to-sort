const fs = require('fs');
let htmlContent = fs.readFileSync('index.html', 'utf8');

const mainTitle = "Free AI Shorts Generator | Convert Video to Shorts - ViralClip AI";

htmlContent = htmlContent.replace(/<title>.*<\/title>/, `<title>${mainTitle}</title>`);
htmlContent = htmlContent.replace(/<meta name="title" content=".*" \/>/, `<meta name="title" content="${mainTitle}" />`);
htmlContent = htmlContent.replace(/<meta property="og:title" content=".*" \/>/, `<meta property="og:title" content="${mainTitle}" />`);
htmlContent = htmlContent.replace(/<meta property="twitter:title" content=".*" \/>/, `<meta property="twitter:title" content="${mainTitle}" />`);

fs.writeFileSync('index.html', htmlContent);
console.log("Titles synced.");
