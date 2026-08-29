const ytdl = require('ytdl-core');
ytdl.getInfo('https://www.youtube.com/watch?v=jNQXAC9IVRw').then(info => {
  let format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
  if (!format) format = ytdl.chooseFormat(info.formats, { filter: 'audioandvideo' });
  console.log(format.url);
}).catch(console.error);
