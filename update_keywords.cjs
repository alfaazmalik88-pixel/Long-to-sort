const fs = require('fs');
let htmlContent = fs.readFileSync('index.html', 'utf8');

const newKeywords = "opus clip alternative, best opus clip alternative free, free ai shorts generator, convert long video to shorts ai free, youtube video to tiktok converter, podcast to shorts ai, auto subtitle generator free, ai video editor no watermark, repurpose video ai";

htmlContent = htmlContent.replace(/<meta name="keywords" content=".*" \/>/, `<meta name="keywords" content="${newKeywords}" />`);

fs.writeFileSync('index.html', htmlContent);
console.log("Keywords updated for SEO.");
