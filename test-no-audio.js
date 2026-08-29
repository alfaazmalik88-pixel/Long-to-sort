import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg()
  .input('color=c=black:s=1280x720:d=1')
  .inputFormat('lavfi')
  .output('test_no_audio_out.mp4')
  .outputOptions('-c:v', 'libx264')
  .outputOptions('-c:a', 'aac')
  .on('end', () => { console.log('Success!'); process.exit(0); })
  .on('error', (err, stdout, stderr) => { console.log('Error: ' + err.message); console.log(stderr); process.exit(1); })
  .run();
