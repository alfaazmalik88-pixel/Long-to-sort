import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg()
  .input('color=c=black:s=1280x720:d=1')
  .inputFormat('lavfi')
  .videoFilters("drawtext=text='Test':fontcolor=white:fontsize=24:x=10:y=10")
  .output('test_output.mp4')
  .on('end', () => { console.log('Success!'); process.exit(0); })
  .on('error', (err) => { console.log('Error: ' + err.message); process.exit(1); })
  .run();
