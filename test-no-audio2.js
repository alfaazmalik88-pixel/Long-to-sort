import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg()
  .input('test_crop.mp4') // video only
  .output('test_no_audio_out2.mp4')
  .outputOptions('-c:v', 'libx264')
  .outputOptions('-c:a', 'aac')
  .on('end', () => { console.log('Success!'); process.exit(0); })
  .on('error', (err, stdout, stderr) => { console.log('Error: ' + err.message); console.log(stderr); process.exit(1); })
  .run();
