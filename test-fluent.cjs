const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

ffmpeg('dummy.mp4')
  .videoFilters("drawtext=text='Hello, world':fontcolor=white")
  .on('error', (err) => console.error('Error:', err.message))
  .on('end', () => console.log('Finished'))
  .save('out.mp4');
