import ytdl from '@distube/ytdl-core';
ytdl.getInfo('https://www.youtube.com/watch?v=jNQXAC9IVRw')
  .then(info => console.log("Success! Title:", info.videoDetails.title))
  .catch(err => console.error("Error:", err.message));
