import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg()
  .input('color=c=black:s=1280x720:d=1') // this generates video ONLY, NO audio
  .inputFormat('lavfi')
  .output('test_noaudio.mp4')
  .outputOptions('-c:v', 'libx264')
  .outputOptions('-c:a', 'aac') // encoding audio that doesn't exist
  .on('end', () => { console.log('Success!'); process.exit(0); })
  .on('error', (err, stdout, stderr) => { console.log('Error: ' + err.message); process.exit(1); })
  .run();
