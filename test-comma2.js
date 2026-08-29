import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg()
  .input('color=c=black:s=1280x720:d=1')
  .inputFormat('lavfi')
  .videoFilters([
     "crop=ih*(9/16):ih",
     "drawtext=text='Hello, World! Here is a comma, and a colon: and a quote\"':fontcolor=white:fontsize=24:x=10:y=10"
  ])
  .output('test_comma2.mp4')
  .on('end', () => { console.log('Success!'); process.exit(0); })
  .on('error', (err, stdout, stderr) => { console.log('Error: ' + err.message); console.log(stderr); process.exit(1); })
  .run();
