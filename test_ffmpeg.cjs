const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const assFile = path.join(process.cwd(), 'test.ass');
const assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,110,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,6,0,2,10,10,250,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:59:59.00,Default,,0,0,0,,Title
`;
fs.writeFileSync(assFile, assContent);
const command = `ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=2 -vf "crop=ih*(9/16):ih,subtitles='${assFile}'" -c:v libx264 -preset ultrafast -crf 28 test_out.mp4 -y`;
console.log("Command:", command);
exec(command, (err, stdout, stderr) => {
  console.log("Error:", err);
  console.log("Stderr:", stderr.slice(-1000));
});
