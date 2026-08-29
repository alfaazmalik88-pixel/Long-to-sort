const fs = require('fs');
async function test() {
  const fetch = (await import('node-fetch')).default;
  const FormData = (await import('form-data')).default;
  const formData = new FormData();
  formData.append('startTime', '0');
  formData.append('endTime', '1');
  formData.append('aspectRatio', '9:16');
  formData.append('customTitle', 'Test Title');
  formData.append('subtitle', 'Test Subtitle');
  formData.append('video', fs.createReadStream('test_crop.mp4'));
  const res = await fetch('http://localhost:3000/api/render', {
      method: 'POST',
      body: formData
  });
  console.log('Status:', res.status);
}
test();
