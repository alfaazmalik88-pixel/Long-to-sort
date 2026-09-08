import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const OUTPUT_DIR = path.join(process.cwd(), 'outputs');

// Ensure directories exist
try {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} catch (err) {
  console.error("Error creating directories:", err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.floor(Math.random() * 1000)}.mp4`)
});
const upload = multer({ storage });

// Upload Endpoint
app.post('/api/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    console.error("No file uploaded!");
    return res.status(400).json({ error: 'No video file provided.' });
  }
  return res.json({ videoPath: req.file.path });
});

// Trim Endpoint
app.post('/api/trim', (req, res) => {
  const { videoPath, startTime, duration, title, titleSticker } = req.body;
  
  if (!videoPath || !fs.existsSync(videoPath)) {
    return res.status(400).json({ error: 'Invalid or missing video path.' });
  }

  const inputPath = videoPath;
  const outputFileName = `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}.mp4`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  
  const ffmpegPath = 'ffmpeg';

  // Generate .ass file for subtitles if needed
  let assFile = '';
  // VERY IMPORTANT: -ss must be BEFORE -i for fast seeking
  let command = `"${ffmpegPath}" -y -ss ${startTime || 0} -i "${inputPath}" -t ${duration || 10}`;

  if (titleSticker && title) {
    assFile = path.join(OUTPUT_DIR, `sub-${Date.now()}.ass`);
    const assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,80,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,6,0,2,10,10,120,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:59:59.00,Default,,0,0,0,,${title}
`;
    fs.writeFileSync(assFile, assContent);

    const filter = `crop='min(iw,ih*(9/16))':ih,scale=1080:1920,subtitles='${assFile}'`;
    command += ` -vf "${filter}" -c:v libx264 -preset ultrafast -crf 28 -threads 0 -c:a aac -b:a 128k "${outputPath}"`;
  } else {
    const filter = `crop='min(iw,ih*(9/16))':ih,scale=1080:1920`;
    command += ` -vf "${filter}" -c:v libx264 -preset ultrafast -crf 28 -threads 0 -c:a aac -b:a 128k "${outputPath}"`;
  }
  
  console.log("Running command:", command);
  
  exec(command, (error, stdout, stderr) => {
    try {
      // NOTE: We do NOT delete the inputPath here anymore since we reuse it!
      if (assFile && fs.existsSync(assFile)) fs.unlinkSync(assFile);
    } catch (e) {
      console.error("Failed to delete temp subtitle file:", e);
    }

    if (error) {
      console.error('FFmpeg error:', error);
      console.error('FFmpeg stderr:', stderr);
      return res.status(500).json({ error: 'Video processing failed.', details: stderr });
    }

    if (!fs.existsSync(outputPath)) {
       console.error("Output file not found after FFmpeg execution");
       return res.status(500).json({ error: 'Output generation failed.' });
    }

    res.download(outputPath, outputFileName, (err) => {
      try {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (e) {
        console.error("Failed to delete output file:", e);
      }
    });
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
