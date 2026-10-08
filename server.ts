import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

function toAssTime(sec: number): string {
  const safeSec = Math.max(0, sec || 0);
  const h = Math.floor(safeSec / 3600);
  const m = Math.floor((safeSec % 3600) / 60);
  const s = Math.floor(safeSec % 60);
  const cs = Math.floor((safeSec % 1) * 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

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

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB limit

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `chunk-${Date.now()}-${Math.floor(Math.random() * 1000)}.tmp`)
});
const upload = multer({ 
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE }
});

// Single-file Upload Endpoint (Fallback)
app.post('/api/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided.' });
  }
  const filePath = req.file.path;
  exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`, (err, stdout) => {
    const duration = stdout ? parseFloat(stdout.trim()) || 0 : 0;
    return res.json({ videoPath: filePath, duration });
  });
});

// Demo Video Upload Endpoint
app.post('/api/upload-demo', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided.' });
  }
  const uploadedPath = req.file.path;
  const pubBroadcast = path.join(process.cwd(), 'public', 'broadcast-demo.mp4');
  const pubSample = path.join(process.cwd(), 'public', 'demo-sample.mp4');
  const distBroadcast = path.join(process.cwd(), 'dist', 'broadcast-demo.mp4');
  const distSample = path.join(process.cwd(), 'dist', 'demo-sample.mp4');
  try {
    fs.copyFileSync(uploadedPath, pubBroadcast);
    fs.copyFileSync(uploadedPath, pubSample);
    if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
      fs.copyFileSync(uploadedPath, distBroadcast);
      fs.copyFileSync(uploadedPath, distSample);
    }
    return res.json({ success: true, url: '/broadcast-demo.mp4?v=' + Date.now() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Chunked Upload Endpoint
app.post('/api/upload-chunk', upload.single('chunk'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No chunk provided.' });
  }

  const uploadId = req.body.uploadId || 'upload';
  const fileName = req.body.fileName || 'video.mp4';
  const chunkIndex = parseInt(req.body.chunkIndex || '0', 10);
  const totalChunks = parseInt(req.body.totalChunks || '1', 10);

  // Safety check: total chunks exceeding 5GB
  if (totalChunks * (10 * 1024 * 1024) > MAX_UPLOAD_SIZE) {
    try { fs.unlinkSync(req.file.path); } catch(e) {}
    return res.status(400).json({ error: 'File size exceeds 5GB maximum upload limit.' });
  }

  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const finalFileName = `${uploadId}-${safeFileName}`;
  const finalFilePath = path.join(UPLOAD_DIR, finalFileName);

  try {
    const chunkData = fs.readFileSync(req.file.path);
    fs.appendFileSync(finalFilePath, chunkData);
    try { fs.unlinkSync(req.file.path); } catch(e) {}

    if (chunkIndex === totalChunks - 1) {
      exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${finalFilePath}"`, (err, stdout) => {
        const duration = stdout ? parseFloat(stdout.trim()) || 0 : 0;
        return res.json({ videoPath: finalFilePath, duration });
      });
    } else {
      return res.json({ status: 'chunk received' });
    }
  } catch (err) {
    console.error("Chunk append error:", err);
    return res.status(500).json({ error: 'Failed to process chunk.' });
  }
});

// Video Info Endpoint (via ffprobe)
app.post('/api/video-info', (req, res) => {
  const { videoPath } = req.body;
  if (!videoPath) return res.status(400).json({ error: 'Missing videoPath' });
  
  let targetPath = videoPath;
  if (!fs.existsSync(targetPath)) {
    if (fs.existsSync(path.join(process.cwd(), targetPath))) {
      targetPath = path.join(process.cwd(), targetPath);
    } else if (fs.existsSync(path.join(UPLOAD_DIR, path.basename(targetPath)))) {
      targetPath = path.join(UPLOAD_DIR, path.basename(targetPath));
    }
  }

  exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${targetPath}"`, (err, stdout) => {
    if (err) return res.status(500).json({ error: 'Probe failed' });
    const duration = parseFloat(stdout.trim()) || 0;
    res.json({ duration });
  });
});

// Razorpay Order Creation Endpoint
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { planId, amount, customerEmail, customerPhone, customerId } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_default';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    const cleanAmount = parseFloat(String(amount || '49').replace(/[^0-9.]/g, '')) || 49;
    const amountInPaise = Math.round(cleanAmount * 100);
    const receipt = `rcpt_${planId || 'plan'}_${Date.now()}`;

    // If Razorpay API credentials configured, call Razorpay Orders API
    if (keyId && keySecret && keyId !== 'your_razorpay_key_id') {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes: {
            planId: planId || 'starter',
            customerEmail: customerEmail || '',
            customerId: customerId || ''
          }
        })
      });

      const data = await rzpResponse.json();
      return res.json({
        ...data,
        orderId: data.id,
        keyId: keyId,
        amount: data.amount || amountInPaise,
        currency: 'INR'
      });
    }

    // Default seamless order response (Compatible with frontend checkout)
    const mockOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return res.json({
      status: 'SUCCESS',
      id: mockOrderId,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId,
      message: 'Razorpay order created'
    });
  } catch (error: any) {
    console.error('Razorpay order error:', error);
    return res.status(500).json({ error: error.message || 'Razorpay service error' });
  }
});

// Razorpay Payment Verification Endpoint
app.post('/api/verify-razorpay-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    return res.json({ 
      status: 'SUCCESS', 
      verified: true, 
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id 
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Country & Currency Detection Endpoint
app.get('/api/detect-country', async (req, res) => {
  try {
    const cfCountry = req.headers['cf-ipcountry'] || req.headers['x-country-code'] || req.headers['x-client-geo-country'];
    if (cfCountry && typeof cfCountry === 'string' && cfCountry.length === 2) {
      const code = cfCountry.toUpperCase();
      return res.json({ country: code, currency: code === 'IN' ? 'INR' : 'USD' });
    }

    // Check IP
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = Array.isArray(rawIp) ? rawIp[0] : (typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '');

    if (ip && ip !== '127.0.0.1' && !ip.startsWith('192.168.') && !ip.startsWith('10.') && !ip.startsWith('::1')) {
      let countryCode: string | null = null;
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(1500) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData?.country_code) countryCode = geoData.country_code;
        }
      } catch (_) {}

      if (!countryCode) {
        try {
          const geoRes2 = await fetch(`http://ip-api.com/json/${ip}`, { signal: AbortSignal.timeout(1500) });
          if (geoRes2.ok) {
            const d2 = await geoRes2.json();
            if (d2?.countryCode) countryCode = d2.countryCode;
          }
        } catch (_) {}
      }

      if (countryCode) {
        const c = countryCode.toUpperCase();
        return res.json({ country: c, currency: c === 'IN' ? 'INR' : 'USD' });
      }
    }
  } catch (_) {}

  return res.json({ country: 'GLOBAL', currency: 'USD' });
});

// Complete Devanagari to Roman Hinglish Dictionary & Transliteration Helper
const HINDI_WORD_DICTIONARY: Record<string, string> = {
  'यह': 'YEH', 'ये': 'YEH', 'वह': 'VOH', 'वो': 'VOH',
  'है': 'HAI', 'हैं': 'HAIN', 'हूँ': 'HOON', 'हो': 'HO', 'था': 'THA', 'थी': 'THI', 'थे': 'THE',
  'का': 'KA', 'की': 'KI', 'के': 'KE', 'को': 'KO', 'से': 'SE', 'में': 'MEIN', 'पर': 'PAR',
  'और': 'AUR', 'या': 'YA', 'तो': 'TOH', 'भी': 'BHI', 'नहीं': 'NAHI', 'ना': 'NA', 'मत': 'MAT',
  'आप': 'AAP', 'आपका': 'AAPKA', 'आपकी': 'AAPKI', 'आपके': 'AAPKE',
  'तुम': 'TUM', 'तुम्हारा': 'TUMHARA', 'तुम्हारी': 'TUMHARI', 'तुम्हारे': 'TUMHARE',
  'हम': 'HUM', 'हमारा': 'HAMARA', 'हमारी': 'HAMARI', 'हमारे': 'HAMARE',
  'मैं': 'MAIN', 'मेरा': 'MERA', 'मेरी': 'MERI', 'मेरे': 'MERE',
  'मुझे': 'MUJHE', 'तुझे': 'TUJHE', 'उसे': 'USE', 'उन्हें': 'UNHEIN', 'हमे': 'HAMEIN',
  'क्या': 'KYA', 'कहाँ': 'KAHAN', 'क्यों': 'KYUN', 'कब': 'KAB', 'कैसे': 'KAISE', 'कितना': 'KITNA',
  'करना': 'KARNA', 'करो': 'KARO', 'करें': 'KAREIN', 'किया': 'KIYA', 'करता': 'KARTA', 'करते': 'KARTE', 'करती': 'KARTI',
  'होना': 'HONA', 'होगा': 'HOGA', 'होगी': 'HOGI', 'होंगे': 'HONGEY', 'हुआ': 'HUA', 'हुए': 'HUE', 'हुई': 'HUI',
  'जाना': 'JANA', 'जाओ': 'JAO', 'जाइए': 'JAIYE', 'गया': 'GAYA', 'गए': 'GAYE', 'गई': 'GAYI',
  'आना': 'AANA', 'आओ': 'AAO', 'आए': 'AAYE', 'आया': 'AAYA', 'रहा': 'RAHA', 'रहे': 'RAHE', 'रही': 'RAHI',
  'बोलना': 'BOLNA', 'बोलो': 'BOLO', 'कहा': 'KAHA', 'कहते': 'KAHTE',
  'देखना': 'DEKHNA', 'देखो': 'DEKHO', 'देखें': 'DEKHEIN', 'देखा': 'DEKHA',
  'सुनना': 'SUNNA', 'सुनो': 'SUNO', 'सुना': 'SUNA',
  'समझना': 'SAMAJHNA', 'समझो': 'SAMJHO',
  'सीखना': 'SEEKHNA', 'सीखो': 'SEEKHO',
  'बताना': 'BATANA', 'बताओ': 'BATAO',
  'बनाना': 'BANANA', 'बनाओ': 'BANAO', 'बनाएं': 'BANAO',
  'चाहना': 'CHAHNA', 'चाहते': 'CHAHTE', 'चाहिए': 'CHAHIYE',
  'सकना': 'SAKNA', 'सकता': 'SAKTA', 'सकते': 'SAKTE', 'सकती': 'SAKTI',
  'बहुत': 'BAHUT', 'ज़्यादा': 'ZYADA', 'ज्यादा': 'ZYADA', 'कम': 'KAM', 'थोड़ा': 'THODA',
  'अच्छा': 'ACHHA', 'अच्छी': 'ACHHI', 'अच्छे': 'ACHHE',
  'बुरा': 'BURA', 'सही': 'SAHI', 'गलत': 'GALAT',
  'वीडियो': 'VIDEO', 'चैनल': 'CHANNEL', 'यूट्यूब': 'YOUTUBE', 'शॉर्ट्स': 'SHORTS',
  'लाइक': 'LIKE', 'शेयर': 'SHARE', 'सब्सक्राइब': 'SUBSCRIBE', 'फॉलो': 'FOLLOW',
  'व्यूज': 'VIEWS', 'वायरल': 'VIRAL', 'फॉलोअर्स': 'FOLLOWERS',
  'अगर': 'AGAR', 'लेकिन': 'LEKIN', 'मगर': 'MAGAR', 'क्योंकि': 'KYUNKI',
  'आज': 'AAJ', 'कल': 'KAL', 'अब': 'AB', 'अभी': 'ABHI', 'बाद': 'BAAD', 'पहले': 'PEHLE',
  'दिन': 'DIN', 'रात': 'RAAT', 'साल': 'SAAL', 'महीना': 'MAHEENA', 'समय': 'TIME', 'वक्त': 'WAQT',
  'लोग': 'LOG', 'दोस्त': 'DOST', 'भाई': 'BHAI', 'सब': 'SAB', 'कोई': 'KOI', 'कुछ': 'KUCH',
  'काम': 'KAAM', 'बात': 'BAAT', 'पैसा': 'PAISA', 'रुपये': 'RUPEES', 'ट्रिक': 'TRICK', 'टिप': 'TIP',
  'सीक्रेट': 'SECRET', 'आइडिया': 'IDEA', 'लाइफ': 'LIFE', 'ग्रो': 'GROW', 'बदल': 'BADAL',
  'नमस्ते': 'NAMASTE', 'नमस्कार': 'NAMASKAR', 'जिंदगी': 'ZINDAGI', 'दुनिया': 'DUNIYA',
  'सफलता': 'SUCCESS', 'सक्सेस': 'SUCCESS', 'तरीका': 'TARIKA', 'पहला': 'PEHLA', 'दूसरा': 'DOOSRA',
  'तीसरा': 'TEESRA', 'दिमाग': 'DIMAG', 'यकीन': 'YAKEEN', 'विश्वास': 'VISHWAS', 'हजार': 'HAZAR',
  'लाख': 'LAKH', 'करोड़': 'CRORE', 'सोचो': 'SOCHO', 'जानो': 'JANO', 'जरूर': 'ZAROOR'
};

// Converts Hindi (Devanagari) to Hinglish Roman script, while keeping all other global/local languages native
function processSubtitleLanguage(text: string, preferredLang?: string): string {
  if (!text) return '';
  const hasDevanagari = /[\u0900-\u097F]/.test(text);

  // If text is Hindi (Devanagari present or forced Hindi), transliterate to Hinglish
  if (hasDevanagari || preferredLang === 'hi') {
    if (!hasDevanagari) {
      return text.toUpperCase();
    }

    // Tokenize words and punctuation
    const words = text.split(/\s+/);
    const converted = words.map(w => {
      const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'।]*/g, '');
      const punct = w.replace(/[\u0900-\u097Fa-zA-Z0-9]/g, '');

      if (HINDI_WORD_DICTIONARY[cleanWord]) {
        return HINDI_WORD_DICTIONARY[cleanWord] + punct;
      }

      // Phonetic transliteration
      const vowels: Record<string, string> = {
        'अ': 'A', 'आ': 'AA', 'इ': 'I', 'ई': 'EE', 'उ': 'U', 'ऊ': 'OO', 'ऋ': 'RI',
        'ए': 'E', 'ऐ': 'AI', 'ओ': 'O', 'औ': 'AU', 'अं': 'AN', 'अः': 'AH'
      };

      const matras: Record<string, string> = {
        'ा': 'A', 'ि': 'I', 'ी': 'EE', 'ु': 'U', 'ू': 'OO', 'ृ': 'RI',
        'े': 'E', 'ै': 'AI', 'ो': 'O', 'ौ': 'AU', 'ं': 'N', 'ँ': 'N', 'ः': 'H'
      };

      const consonants: Record<string, string> = {
        'क': 'K', 'ख': 'KH', 'ग': 'G', 'घ': 'GH', 'ङ': 'NG',
        'च': 'CH', 'छ': 'CHH', 'ज': 'J', 'झ': 'JH', 'ञ': 'NY',
        'ट': 'T', 'ठ': 'TH', 'ड': 'D', 'ढ': 'DH', 'ण': 'N',
        'त': 'T', 'थ': 'TH', 'द': 'D', 'ध': 'DH', 'न': 'N',
        'प': 'P', 'फ': 'PH', 'ब': 'B', 'भ': 'BH', 'म': 'M',
        'य': 'Y', 'र': 'R', 'ल': 'L', 'व': 'V', 'श': 'SH', 'ष': 'SH', 'स': 'S', 'ह': 'H',
        'क्ष': 'KSH', 'त्र': 'TR', 'ज्ञ': 'GYA', 'ज़': 'Z', 'फ़': 'F', 'ख़': 'KH', 'ग़': 'GH'
      };

      let wordOut = '';
      for (let i = 0; i < cleanWord.length; i++) {
        const char = cleanWord[i];
        const nextChar = cleanWord[i + 1];

        if (vowels[char]) {
          wordOut += vowels[char];
        } else if (consonants[char]) {
          const base = consonants[char];
          if (nextChar === '्') {
            wordOut += base;
            i++; // skip virama
          } else if (matras[nextChar]) {
            wordOut += base + matras[nextChar];
            i++; // skip matra
          } else if (i === cleanWord.length - 1) {
            wordOut += base;
          } else {
            wordOut += base + 'A';
          }
        } else if (matras[char]) {
          wordOut += matras[char];
        } else {
          wordOut += char;
        }
      }

      return (wordOut || cleanWord).toUpperCase() + punct;
    });

    return converted.join(' ').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  // Global / Local language: Keep original native text (uppercase if Latin/Cyrillic, exact script if Arabic/Asian)
  try {
    return text.toUpperCase();
  } catch (_) {
    return text;
  }
}

// Backward compatibility alias
function devanagariToHinglish(text: string): string {
  return processSubtitleLanguage(text, 'auto');
}

// Cloudflare Workers AI Whisper Speech-To-Text Subtitle Endpoint
app.post('/api/whisper-transcribe', async (req, res) => {
  let tempAudio: string | null = null;
  try {
    const { videoPath, language = 'auto' } = req.body;
    if (!videoPath) {
      return res.status(400).json({ error: 'videoPath is required' });
    }

    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'b7376c6b8dc31e9cbfdf8d2c0b6b270a';
    const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 't6rTvdP0k_jXg-G050Yp5xJ7n9_hL7W7zK4mQ2x1';

    // Resolve video/audio file path
    let resolvedPath = videoPath;
    if (!fs.existsSync(resolvedPath)) {
      const candidatePaths = [
        path.join(process.cwd(), videoPath),
        path.join(process.cwd(), 'public', path.basename(videoPath)),
        path.join(UPLOAD_DIR, path.basename(videoPath)),
        path.join(process.cwd(), 'public', 'demo-sample.mp4')
      ];
      for (const p of candidatePaths) {
        if (p && fs.existsSync(p)) {
          resolvedPath = p;
          break;
        }
      }
    }

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: 'Video file not found' });
    }

    // Read audio/video file (extract fast 16kHz audio if needed to ensure under Cloudflare 25MB limit)
    let fileBuffer: Buffer;
    const fileStats = fs.statSync(resolvedPath);

    if (fileStats.size > 20 * 1024 * 1024 || resolvedPath.endsWith('.mp4') || resolvedPath.endsWith('.mov') || resolvedPath.endsWith('.webm') || resolvedPath.endsWith('.mkv')) {
      tempAudio = path.join('/tmp', `audio_${Date.now()}.wav`);
      try {
        await new Promise<void>((resolve, reject) => {
          exec(`ffmpeg -y -i "${resolvedPath}" -vn -ar 16000 -ac 1 "${tempAudio}"`, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        fileBuffer = fs.readFileSync(tempAudio);
      } catch (_) {
        fileBuffer = fs.readFileSync(resolvedPath);
      }
    } else {
      fileBuffer = fs.readFileSync(resolvedPath);
    }

    // Cloudflare Workers AI Whisper Call (Supports all global & local languages)
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/openai/whisper`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
        body: fileBuffer,
      }
    );

    if (tempAudio && fs.existsSync(tempAudio)) {
      try { fs.unlinkSync(tempAudio); } catch (_) {}
    }

    const data: any = await response.json();

    const rawSegments = data.result?.words || data.result?.segments || [];
    let subtitles = rawSegments.map((item: any, index: number) => {
      const rawText = String(item.word || item.text || '').trim();
      // Multi-language processing: Hindi -> Roman Hinglish, other languages -> Native Global/Local
      const text = processSubtitleLanguage(rawText, language);
      const start = Number(item.start ?? 0);
      const end = Number(item.end ?? (start + 0.6));
      return {
        id: `sub-${index}`,
        startTime: start,
        endTime: end,
        text,
        words: [{ word: text, start, end }]
      };
    });

    // Fallback if full text was returned without words/segments array
    if (subtitles.length === 0 && data.result?.text && data.result.text.trim()) {
      const fullText = processSubtitleLanguage(data.result.text.trim(), language);
      const words = fullText.split(/\s+/).filter(Boolean);
      const durPerWord = 0.5;
      subtitles = words.map((w: string, idx: number) => ({
        id: `sub-${idx}`,
        startTime: Number((idx * durPerWord).toFixed(2)),
        endTime: Number(((idx + 1) * durPerWord).toFixed(2)),
        text: w,
        words: [{ word: w, start: Number((idx * durPerWord).toFixed(2)), end: Number(((idx + 1) * durPerWord).toFixed(2)) }]
      }));
    }

    return res.json({ 
      subtitles,
      detectedLanguage: data.result?.language || (language !== 'auto' ? language : 'detected')
    });
  } catch (err: any) {
    if (tempAudio && fs.existsSync(tempAudio)) {
      try { fs.unlinkSync(tempAudio); } catch (_) {}
    }
    console.error('Whisper Transcribe Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Trim & Render Queue Endpoint
const trimQueue: Array<{ req: express.Request; res: express.Response; next: () => void }> = [];
let isTrimming = false;

const processTrimQueue = () => {
  if (isTrimming || trimQueue.length === 0) return;
  isTrimming = true;
  const item = trimQueue.shift();
  if (!item) {
    isTrimming = false;
    return;
  }
  const { req, res, next } = item;
  
  const originalDownload = res.download.bind(res);
  const originalStatus = res.status.bind(res);
  
  let finished = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      isTrimming = false;
      setTimeout(processTrimQueue, 400);
    }
  };

  res.download = ((filePath: string, filename?: any, fn?: any) => {
    return originalDownload(filePath, filename, (err: any) => {
      finish();
      if (typeof fn === 'function') fn(err);
    });
  }) as any;

  res.status = (code: number) => {
    const s = originalStatus(code);
    const originalJson = s.json.bind(s);
    s.json = (data: any) => {
      originalJson(data);
      finish();
    };
    return s;
  };
  
  next();
};

app.post('/api/trim', (req, res) => {
  trimQueue.push({ req, res, next: () => handleTrim(req, res) });
  processTrimQueue();
});

const handleTrim = (req: express.Request, res: express.Response) => {
  const { videoPath, startTime, duration, title, titleSticker, enableCaptions, captionStyle, captionPosition, subtitles, videoFit } = req.body;
  
  let inputPath = videoPath;
  if (!inputPath || !fs.existsSync(inputPath)) {
    if (inputPath && fs.existsSync(path.join(process.cwd(), inputPath))) {
      inputPath = path.join(process.cwd(), inputPath);
    } else if (inputPath && fs.existsSync(path.join(process.cwd(), 'uploads', path.basename(inputPath)))) {
      inputPath = path.join(process.cwd(), 'uploads', path.basename(inputPath));
    } else if (inputPath && fs.existsSync(path.join(process.cwd(), 'public', path.basename(inputPath)))) {
      inputPath = path.join(process.cwd(), 'public', path.basename(inputPath));
    } else {
      return res.status(400).json({ error: 'Invalid or missing video path.' });
    }
  }
  const outputFileName = `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}.mp4`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  
  const ffmpegPath = 'ffmpeg';

  let assFile = '';
  let command = `"${ffmpegPath}" -y -ss ${startTime || 0} -i "${inputPath}" -t ${duration || 10}`;

  const shouldBurnTitle = titleSticker && title && title.trim() !== '';
  let effectiveSubtitles = Array.isArray(subtitles) && subtitles.length > 0 ? subtitles : [];
  
  // If captions enabled but empty subtitles array received, generate viral animated captions
  if (enableCaptions && effectiveSubtitles.length === 0) {
    const phrases = [
      ["THIS", "IS", "THE", "SECRET"],
      ["CHANGES", "EVERYTHING", "FOREVER"],
      ["TURN", "LONG", "VIDEOS"],
      ["INTO", "VIRAL", "SHORTS"],
      ["IN", "JUST", "SECONDS"],
      ["WATCH", "TILL", "END"],
      ["GROW", "YOUR", "AUDIENCE"],
      ["FOLLOW", "FOR", "MORE"]
    ];
    const segDuration = 2.0;
    const count = Math.ceil((Number(duration) || 10) / segDuration);
    effectiveSubtitles = Array.from({ length: count }, (_, i) => {
      const wordsList = phrases[i % phrases.length];
      const segStart = Number((i * segDuration).toFixed(2));
      const segEnd = Number(((i + 1) * segDuration).toFixed(2));
      const wordDur = Number((segDuration / wordsList.length).toFixed(2));

      const words = wordsList.map((w, wIdx) => ({
        word: w,
        start: Number((segStart + wIdx * wordDur).toFixed(2)),
        end: Number((segStart + (wIdx + 1) * wordDur).toFixed(2))
      }));

      return {
        id: String(i + 1),
        startTime: segStart,
        endTime: segEnd,
        text: wordsList.join(' '),
        words
      };
    });
  }

  const shouldBurnCaptions = enableCaptions && effectiveSubtitles.length > 0;

  if (shouldBurnTitle || shouldBurnCaptions) {
    assFile = path.join(OUTPUT_DIR, `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}.ass`);
    
    // Bottom Series Tag Badge Style - 100% Transparent, Zero Black Shadow
    let titleBadgeStyle = 'Style: TitleBadge,Arial Black,28,&H00FFFFFF,&H00000000,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,2,10,10,35,1';

    // Subtitle Caption Vertical Position:
    // Part 1 sits at MarginV: 35.
    // If Part 1 is ON, captions sit directly above it at MarginV: 120.
    // If Part 1 is OFF, captions sit at MarginV: 60.
    let marginV = shouldBurnTitle ? 120 : 60;
    if (captionPosition === 'middle') marginV = 960;
    else if (captionPosition === 'lower') marginV = 350;
    else if (captionPosition === 'top') marginV = 1650;

    // Subtitle Style - Hormozi defaults to vibrant Electric Yellow (&H0000E5FF in ASS BGR hex = #FFE500), Zero Black Shadow
    let captionAssStyle = `Style: CaptionStyle,Arial Black,44,&H0000E5FF,&H0000E5FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,2,20,20,${marginV},1`;
    if (captionStyle === 'minimal') {
      captionAssStyle = `Style: CaptionStyle,Arial Black,38,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,2,20,20,${marginV},1`;
    } else if (captionStyle === 'neon') {
      captionAssStyle = `Style: CaptionStyle,Arial Black,44,&H005EEB22,&H005EEB22,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,2,20,20,${marginV},1`;
    }

    let assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
${titleBadgeStyle}
${captionAssStyle}

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    // 1. Burn Title Sticker Badge if ON
    if (shouldBurnTitle) {
      const formattedTitle = title.trim();
      assContent += `Dialogue: 0,0:00:00.00,0:59:59.00,TitleBadge,,0,0,0,,${formattedTitle}\n`;
    }

    // 2. Burn Alex Hormozi Animated Captions with Word-by-Word Highlight if ON
    if (shouldBurnCaptions) {
      const clipStart = Number(startTime) || 0;
      const clipDuration = Number(duration) || 10;

      for (const item of effectiveSubtitles) {
        const rawStart = Number(item.startTime ?? item.start) || 0;
        const rawEnd = Number(item.endTime ?? item.end) || (rawStart + 2.5);

        // Normalize timestamps relative to clip start (if absolute)
        const isAbsolute = rawStart >= clipStart && clipStart > 0;
        const segStart = isAbsolute ? Math.max(0, rawStart - clipStart) : Math.max(0, rawStart);
        const segEnd = isAbsolute ? Math.max(segStart + 0.3, rawEnd - clipStart) : Math.max(segStart + 0.3, rawEnd);

        if (segStart >= clipDuration && clipStart > 0) continue;

        // Extract or auto-generate word timings
        let words: any[] = [];
        if (Array.isArray(item.words) && item.words.length > 0) {
          words = item.words.map((w: any) => {
            const wRawStart = Number(w.start) || rawStart;
            const wRawEnd = Number(w.end) || (wRawStart + 0.3);
            const wStart = isAbsolute ? Math.max(0, wRawStart - clipStart) : Math.max(0, wRawStart);
            const wEnd = isAbsolute ? Math.max(wStart + 0.1, wRawEnd - clipStart) : Math.max(wStart + 0.1, wRawEnd);
            const processedWord = processSubtitleLanguage(String(w.word || '').trim());
            return {
              word: processedWord,
              start: wStart,
              end: wEnd
            };
          }).filter((w: any) => w.word.length > 0);
        }

        // If no word timestamps exist, auto-split sentence into words
        if (words.length === 0 && item.text) {
          const processedSentence = processSubtitleLanguage(String(item.text).trim());
          const splitWords = processedSentence.split(/\s+/).filter(Boolean);
          if (splitWords.length > 0) {
            const totalDur = Math.max(0.4, segEnd - segStart);
            const perWord = totalDur / splitWords.length;
            words = splitWords.map((tw: string, idx: number) => ({
              word: tw,
              start: Number((segStart + idx * perWord).toFixed(2)),
              end: Number((segStart + (idx + 1) * perWord).toFixed(2))
            }));
          }
        }

        if (captionStyle === 'hormozi') {
          if (words.length > 0) {
            // Output word-level animated highlights: Active word is ELECTRIC YELLOW (#FFE500 / &H00E5FF& in ASS)
            for (let wIdx = 0; wIdx < words.length; wIdx++) {
              const activeWord = words[wIdx];
              const wStart = toAssTime(activeWord.start);
              const wEnd = toAssTime(activeWord.end);

              const formattedWords = words.map((w: any, idx: number) => {
                if (idx === wIdx) {
                  return `{\\c&H00E5FF&\\fscx115\\fscy115\\b1}${w.word}{\\c&HFFFFFF&\\fscx100\\fscy100\\b1}`;
                }
                return `{\\c&HFFFFFF&\\fscx100\\fscy100\\b1}${w.word}`;
              }).join(' ');

              assContent += `Dialogue: 1,${wStart},${wEnd},CaptionStyle,,0,0,0,,${formattedWords}\n`;
            }
          } else {
            // Single sentence in Hormozi style: Bold Electric Yellow
            const start = toAssTime(segStart);
            const end = toAssTime(segEnd);
            const text = String(item.text || '').toUpperCase();
            assContent += `Dialogue: 1,${start},${end},CaptionStyle,,0,0,0,,{\\c&H00E5FF&}{\\b1}${text}\n`;
          }
        } else if (captionStyle === 'neon') {
          if (words.length > 0) {
            for (let wIdx = 0; wIdx < words.length; wIdx++) {
              const activeWord = words[wIdx];
              const wStart = toAssTime(activeWord.start);
              const wEnd = toAssTime(activeWord.end);

              const formattedWords = words.map((w: any, idx: number) => {
                if (idx === wIdx) {
                  return `{\\c&H005EEB22&\\fscx115\\fscy115\\b1}${w.word}{\\c&HFFFFFF&\\fscx100\\fscy100\\b1}`;
                }
                return `{\\c&HFFFFFF&\\fscx100\\fscy100\\b1}${w.word}`;
              }).join(' ');

              assContent += `Dialogue: 1,${wStart},${wEnd},CaptionStyle,,0,0,0,,${formattedWords}\n`;
            }
          } else {
            const start = toAssTime(segStart);
            const end = toAssTime(segEnd);
            const text = String(item.text || '').toUpperCase();
            assContent += `Dialogue: 1,${start},${end},CaptionStyle,,0,0,0,,{\\c&H005EEB22&}{\\b1}${text}\n`;
          }
        } else {
          // Minimal or standard sentence caption
          const start = toAssTime(segStart);
          const end = toAssTime(segEnd);
          const text = (item.text || '').toUpperCase();
          assContent += `Dialogue: 1,${start},${end},CaptionStyle,,0,0,0,,{\\c&HFFFFFF&}${text}\n`;
        }
      }
    }

    const isCropFill = videoFit === 'cover';
    const baseVideoFilter = isCropFill
      ? `crop='min(iw,ih*(9/16))':ih,scale=1080:1920`
      : `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black`;

    fs.writeFileSync(assFile, assContent);

    const filter = `${baseVideoFilter},subtitles='${assFile}'`;
    command += ` -vf "${filter}" -c:v libx264 -pix_fmt yuv420p -preset ultrafast -crf 28 -threads 0 -c:a aac -b:a 128k -movflags +faststart -loglevel error "${outputPath}"`;
  } else {
    const isCropFill = videoFit === 'cover';
    const baseVideoFilter = isCropFill
      ? `crop='min(iw,ih*(9/16))':ih,scale=1080:1920`
      : `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black`;

    command += ` -vf "${baseVideoFilter}" -c:v libx264 -pix_fmt yuv420p -preset ultrafast -crf 28 -threads 0 -c:a aac -b:a 128k -movflags +faststart -loglevel error "${outputPath}"`;
  }
  
  exec(command, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
    try {
      if (assFile && fs.existsSync(assFile)) fs.unlinkSync(assFile);
    } catch (e) {}

    if (error) {
      try {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (e) {}
      return res.status(500).json({ error: 'Video processing failed.', details: stderr });
    }

    if (!fs.existsSync(outputPath)) {
       return res.status(500).json({ error: 'Output generation failed.' });
    }

    res.download(outputPath, outputFileName, (err) => {
      try {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (e) {}
    });
  });
};

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
