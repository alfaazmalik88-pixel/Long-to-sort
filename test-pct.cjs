const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const videoPath = 'dummy.mp4';
const escapedSub = '100% video';
const filters = [];
filters.push(`drawtext=text='${escapedSub}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h-80):bordercolor=black:borderw=3`);
const vfString = filters.join(',');

let command = ffmpeg(videoPath)
  .outputOptions('-c:v', 'libx264')
  .videoFilters(vfString)
  .on('error', (err, stdout, stderr) => {
    console.error("Error:", err.message);
    console.error("Stderr:", stderr);
  }).on('end', () => {
    console.log("Success");
  }).save('out4.mp4');
