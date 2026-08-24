import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 4GB limit for long videos
const upload = multer({ dest: "uploads/", limits: { fileSize: 4000 * 1024 * 1024 } });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Video Analysis
  app.post("/api/analyze", upload.single("video"), async (req, res) => {
    // Increase server timeout for long videos
    req.setTimeout(0);
    res.setTimeout(0);
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No video file provided" });
      }

      const clipDuration = parseInt(req.body.clipDuration || "60");

      console.log(`Received video file: ${req.file.originalname} (${req.file.size} bytes), target duration: ${clipDuration}s`);

      // Initialize Gemini API
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in the environment.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // 1. Upload file to Gemini
      console.log("Uploading to Gemini File API...");
      const fileUpload = await ai.files.upload({
        file: req.file.path,
        config: {
          mimeType: req.file.mimetype,
        }
      });

      console.log(`Uploaded as ${fileUpload.name}. Waiting for processing...`);

      // 2. Poll until processing is complete
      let state = await ai.files.get({ name: fileUpload.name });
      let retries = 0;
      while (state.state === "PROCESSING" && retries < 30) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        state = await ai.files.get({ name: fileUpload.name });
        retries++;
      }

      if (state.state === "FAILED") {
        throw new Error("Video processing failed in Gemini API.");
      }

      // 3. Prompt Gemini for clips
      console.log(`Analyzing content with Gemini 3.7 Flash for ~${clipDuration}s clips...`);
      const prompt = `You are an expert video editor.
Divide the ENTIRE video from start to finish into consecutive short-form clips.
Each clip MUST be approximately ${clipDuration} seconds long.
Do NOT skip any parts of the video. The clips must run consecutively covering the full video from 0:00 to the end.
For each clip, generate a catchy title, a virality score, and the transcript/captions for that segment.

Return ONLY a JSON array of objects with this exact structure, nothing else:
[
  {
    "id": "unique-string-id",
    "title": "Part 1: Catchy Title",
    "viralityScore": 95,
    "startTime": 0,
    "endTime": ${clipDuration},
    "duration": ${clipDuration},
    "transcript": "Exact words spoken in this segment"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          {
            role: "user",
            parts: [
              { fileData: { fileUri: fileUpload.uri, mimeType: fileUpload.mimeType } },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      // 4. Clean up local file and optionally the Gemini file
      fs.unlinkSync(req.file.path);
      try {
        await ai.files.delete({ name: fileUpload.name });
      } catch (e) {
        console.warn("Failed to delete file from Gemini:", e);
      }

      const clipsJson = response.text || "[]";
      const clips = JSON.parse(clipsJson);

      res.json({ clips });
    } catch (error: any) {
      console.error("Error during analysis:", error);
      // Ensure file cleanup on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message || "Failed to analyze video" });
    }
  });

  // Mock endpoint for YouTube links (since ytdl is unreliable in browser/server without proxies)
  app.post("/api/analyze-url", async (req, res) => {
    // We will just return a mock response after a delay for YouTube links,
    // as downloading arbitrary YT videos in real-time requires complex backend tools.
    setTimeout(() => {
      res.json({
        clips: [
          {
            id: "yt-1",
            title: "The Ultimate Hook",
            viralityScore: 92,
            startTime: 30,
            endTime: 75,
            duration: 45,
            transcript: "This is a simulated clip from the provided URL. For real AI processing, please upload a video file.",
          },
        ],
      });
    }, 3000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
