const youtubedl = require('youtube-dl-exec');
youtubedl('https://www.youtube.com/watch?v=jNQXAC9IVRw', {
  dumpJson: true,
  noWarnings: true,
  noCallHome: true,
  noCheckCertificate: true,
  preferFreeFormats: true,
  referer: 'https://www.youtube.com/'
}).then(output => console.log("Success! Title:", output.title)).catch(err => console.error("Error:", err.message));
