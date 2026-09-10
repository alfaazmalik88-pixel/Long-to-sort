const fs = require('fs');
let htmlContent = fs.readFileSync('index.html', 'utf8');

// Replace og:title and twitter:title
htmlContent = htmlContent.replace(/<meta property="og:title" content="Free AI Shorts Generator \| Best Opus Clip Alternative" \/>/g, '<meta property="og:title" content="ViralClip AI | Free AI Shorts Generator" />');
htmlContent = htmlContent.replace(/<meta property="twitter:title" content="Free AI Shorts Generator \| Best Opus Clip Alternative" \/>/g, '<meta property="twitter:title" content="ViralClip AI | Free AI Shorts Generator" />');

// Replace description references
htmlContent = htmlContent.replace(/The #1 Opus Clip alternative\. /gi, '');
htmlContent = htmlContent.replace(/ A free alternative to Opus Clip\./gi, '');

// Replace keywords list
htmlContent = htmlContent.replace(/opus clip alternative free, /gi, '');
htmlContent = htmlContent.replace(/"Opus Clip Alternative Free"/gi, '"Video to Shorts Converter"');

fs.writeFileSync('index.html', htmlContent);
console.log("SEO and Titles updated to remove Opus Clip references.");
