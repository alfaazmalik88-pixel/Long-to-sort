import play from 'play-dl';
play.video_info('https://www.youtube.com/watch?v=jNQXAC9IVRw')
  .then(info => console.log("Success! Title:", info.video_details.title))
  .catch(err => console.error("Error:", err.message));
