const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/upload-chunk',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', error => console.error(error));

req.write('------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n');
req.write('Content-Disposition: form-data; name="chunk"; filename="chunk.mp4"\r\n');
req.write('Content-Type: video/mp4\r\n\r\n');
req.write('file contents here\r\n');
req.write('------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n');
req.write('Content-Disposition: form-data; name="jobId"\r\n\r\n');
req.write('test_job\r\n');
req.write('------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n');
req.write('Content-Disposition: form-data; name="chunkIndex"\r\n\r\n');
req.write('0\r\n');
req.write('------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n');
req.write('Content-Disposition: form-data; name="totalChunks"\r\n\r\n');
req.write('1\r\n');
req.write('------WebKitFormBoundary7MA4YWxkTrZu0gW--\r\n');
req.end();
