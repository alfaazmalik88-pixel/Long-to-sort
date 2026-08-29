const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function run() {
  const videoId = 'test_vid';
  const uploadDir = path.join(process.cwd(), 'uploads');
  const videoPath = path.join(uploadDir, `${videoId}_combined.mp4`);
  
  if (!fs.existsSync(videoPath)) {
    console.log("Downloading demo video...");
    const { execSync } = require('child_process');
    execSync(`curl -o ${videoPath} https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`);
  }

  const escapedTitle = "Test";
  const escapedSub = "Part 1";
  const filters = [];
  filters.push('crop=ih*(9/16):ih');
  filters.push(`drawtext=text='${escapedTitle}':fontcolor=yellow:fontsize=48:x=(w-text_w)/2:y=(h/4):bordercolor=black:borderw=4`);
  filters.push(`drawtext=text='${escapedSub}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h-80):bordercolor=black:borderw=3`);
  
  const vfString = filters.join(',');
  
  ffmpeg(videoPath)
    .setStartTime(0)
    .setDuration(5)
    .outputOptions('-c:v', 'libx264')
    .outputOptions('-preset', 'fast')
    .outputOptions('-crf', '18')
    .outputOptions('-c:a', 'aac')
    .outputOptions('-b:a', '192k')
    .outputOptions('-threads', '2')
    .outputOptions('-movflags', '+faststart')
    .videoFilters(vfString)
    .on('error', (err, stdout, stderr) => {
      console.error("Error:", err.message);
      console.error("Stderr:", stderr);
    })
    .on('end', () => console.log("Success!"))
    .save('test_final.mp4');
}

run();
