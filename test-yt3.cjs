const youtubedl = require('youtube-dl-exec');
youtubedl('https://www.youtube.com/watch?v=jNQXAC9IVRw', {
  dumpJson: true,
  extractorArgs: "youtube:player_client=ios,web",
}).then(output => console.log("Success! Title:", output.title)).catch(err => console.error("Error:", err.message));
