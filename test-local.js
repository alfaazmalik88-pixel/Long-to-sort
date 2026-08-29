import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

console.log("Generating sample video...");
ffmpeg()
  .input('color=c=black:s=1280x720:d=15')
  .inputFormat('lavfi')
  .output('sample.mp4')
  .on('end', () => {
    console.log("Sample created. Sending to server...");
    sendToServer();
  })
  .run();

async function sendToServer() {
  const formData = new FormData();
  formData.append('startTime', '0');
  formData.append('endTime', '10');
  formData.append('aspectRatio', '9:16');
  formData.append('customTitle', 'Test Title');
  formData.append('subtitle', 'Test Subtitle');
  
  const blob = new Blob([fs.readFileSync('sample.mp4')], { type: 'video/mp4' });
  formData.append('video', blob, 'sample.mp4');

  try {
    const res = await fetch('http://localhost:3000/api/render', {
      method: 'POST',
      body: formData
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.substring(0, 100));
  } catch(e) {
    console.log("Fetch error:", e.message);
  }
}
