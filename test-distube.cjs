const ytdl = require('@distube/ytdl-core');
ytdl.getInfo('https://www.youtube.com/watch?v=jNQXAC9IVRw').then(info => {
  let format = ytdl.chooseFormat(info.formats, { filter: 'audioandvideo' });
  console.log(format.url);
}).catch(console.error);
