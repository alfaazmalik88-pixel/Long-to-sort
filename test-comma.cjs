const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const videoPath = 'dummy.mp4';
const startTime = 0;
const endTime = 2;
const escapedTitle = 'My Title';
const escapedSub = 'Part 1, test';
const filters = [];
filters.push('crop=ih*(9/16):ih');
filters.push(`drawtext=text='${escapedTitle}':fontcolor=yellow:fontsize=48:x=(w-text_w)/2:y=(h/3.5):bordercolor=black:borderw=4`);
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
  }).save('out3.mp4');
