import fs from 'fs';
async function test() {
  const fetch = (await import('node-fetch')).default;
  const FormData = (await import('form-data')).default;
  const formData = new FormData();
  formData.append('startTime', '0');
  formData.append('endTime', '1');
  formData.append('aspectRatio', '9:16');
  formData.append('jobId', 'test-job-123');
  formData.append('video', fs.createReadStream('test_crop.mp4'));
  
  console.log("Sending request to /api/render/start...");
  const res = await fetch('http://localhost:3000/api/render/start', {
      method: 'POST',
      body: formData
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
  
  console.log("Polling /api/render/status/test-job-123...");
  const statusRes = await fetch('http://localhost:3000/api/render/status/test-job-123');
  console.log('Status HTTP:', statusRes.status);
  console.log('Status Body:', await statusRes.text());
}
test();
