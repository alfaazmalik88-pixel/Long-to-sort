const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const videoPath = 'dummy.mp4';
const startTime = 0;
const endTime = 2;
const escapedTitle = 'My Title';
const escapedSub = 'Part 1';
const filters = [];
filters.push('crop=ih*(9/16):ih');
filters.push(`drawtext=text='${escapedTitle}':fontcolor=yellow:fontsize=48:x=(w-text_w)/2:y=(h/3.5):bordercolor=black:borderw=4`);
filters.push(`drawtext=text='${escapedSub}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h-80):bordercolor=black:borderw=3`);
const vfString = filters.join(',');

let command = ffmpeg(videoPath)
  .setStartTime(startTime)
  .setDuration(endTime - startTime)
  .outputOptions('-c:v', 'libx264')
  .outputOptions('-preset', 'fast')
  .outputOptions('-crf', '18')
  .outputOptions('-c:a', 'aac') 
  .outputOptions('-b:a', '192k')
  .outputOptions('-threads', '2')
  .outputOptions('-movflags', '+faststart');

if (vfString) {
  command = command.videoFilters(vfString);
}

command.on('error', (err, stdout, stderr) => {
  console.error("Error:", err.message);
  console.error("Stderr:", stderr);
}).on('end', () => {
  console.log("Success");
}).save('out2.mp4');
