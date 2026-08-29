const youtubedl = require('youtube-dl-exec');
youtubedl('https://www.youtube.com/watch?v=jNQXAC9IVRw', {
  dumpJson: true,
  proxy: 'http://67.203.23.79:8081',
  noWarnings: true
}).then(output => console.log("Success! Title:", output.title)).catch(err => console.error("Error:", err.message));
