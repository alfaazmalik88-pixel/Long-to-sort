const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const assFile = path.join(process.cwd(), 'test.ass');
fs.writeFileSync(assFile, 'test');
const command = `ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=2 -vf "crop=ih*(9/16):ih,subtitles='${assFile}'" -c:v libx264 -preset ultrafast -crf 28 -c:a copy test_out.mp4 -y`;
console.log("Command:", command);
exec(command, (err, stdout, stderr) => {
  console.log("Error:", err);
  console.log("Stderr:", stderr.slice(-500));
});
