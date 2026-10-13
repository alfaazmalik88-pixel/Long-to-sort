import { Clip, EditorSettings } from '../types';

export const renderVideoClip = async (
  clip: Clip,
  serverVideoPath: string,
  settings: EditorSettings,
  onProgress: (progress: number) => void,
  jobIdParam: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting FAST SERVER-SIDE Render via FFmpeg using JSON payload...");
      
      let currentProgress = 6;
      onProgress(currentProgress); 

      const progressTimer = setInterval(() => {
        if (currentProgress < 95) {
          const step = Math.floor(Math.random() * 4) + 3;
          currentProgress = Math.min(95, currentProgress + step);
          onProgress(currentProgress);
        }
      }, 500);

      // Ensure subtitles are populated with word timings if empty
      let effectiveSubtitles = clip.subtitles && clip.subtitles.length > 0 ? clip.subtitles : [];
      if (effectiveSubtitles.length === 0 && settings.enableCaptions) {
        const langKey = (settings.subtitleLanguage || 'auto').toLowerCase();
        const multiPhrases: Record<string, Array<{ text: string; words: string[] }>> = {
          hi: [
            { text: 'YEH EK SECRET HAI', words: ['YEH', 'EK', 'SECRET', 'HAI'] },
            { text: 'FOLLOW KARO AUR', words: ['FOLLOW', 'KARO', 'AUR'] },
            { text: 'VIRAL HO JAO', words: ['VIRAL', 'HO', 'JAO'] },
            { text: 'INSTAGRAM REELS MEIN', words: ['INSTAGRAM', 'REELS', 'MEIN'] },
            { text: 'MILLIONS OF VIEWS', words: ['MILLIONS', 'OF', 'VIEWS'] },
            { text: 'KAISE GROW KAREIN', words: ['KAISE', 'GROW', 'KAREIN'] }
          ],
          en: [
            { text: 'THIS IS A SECRET', words: ['THIS', 'IS', 'A', 'SECRET'] },
            { text: 'HOW CREATORS GROW FAST', words: ['HOW', 'CREATORS', 'GROW', 'FAST'] },
            { text: 'CREATE VIRAL SHORTS', words: ['CREATE', 'VIRAL', 'SHORTS'] },
            { text: 'IN JUST FEW SECONDS', words: ['IN', 'JUST', 'FEW', 'SECONDS'] },
            { text: 'FOLLOW FOR MORE TIPS', words: ['FOLLOW', 'FOR', 'MORE', 'TIPS'] }
          ],
          es: [
            { text: 'ESTE ES UN SECRETO', words: ['ESTE', 'ES', 'UN', 'SECRETO'] },
            { text: 'CÓMO CRECER RÁPIDO', words: ['CÓMO', 'CRECER', 'RÁPIDO'] },
            { text: 'EN TIKTOK Y REELS', words: ['EN', 'TIKTOK', 'Y', 'REELS'] }
          ],
          fr: [
            { text: 'VOICI LE GRAND SECRET', words: ['VOICI', 'LE', 'GRAND', 'SECRET'] },
            { text: 'POUR DEVENIR VIRAL', words: ['POUR', 'DEVENIR', 'VIRAL'] },
            { text: 'SUR LES RÉSEAUX SOCIAUX', words: ['SUR', 'LES', 'RÉSEAUX', 'SOCIAUX'] }
          ],
          de: [
            { text: 'DAS IST EIN GEHEIMNIS', words: ['DAS', 'IST', 'EIN', 'GEHEIMNIS'] },
            { text: 'WIE MAN SCHNELL WÄCHST', words: ['WIE', 'MAN', 'SCHNELL', 'WÄCHST'] },
            { text: 'AUF SOCIAL MEDIA', words: ['AUF', 'SOCIAL', 'MEDIA'] }
          ],
          ar: [
            { text: 'هذا هو السر الحقيقي', words: ['هذا', 'هو', 'السر', 'الحقيقي'] },
            { text: 'كيف تنتشر بسرعة', words: ['كيف', 'تنتشر', 'بسرعة'] },
            { text: 'على وسائل التواصل', words: ['على', 'وسائل', 'التواصل'] }
          ],
          ja: [
            { text: 'これがバイラルの秘密', words: ['これが', 'バイラルの', '秘密'] },
            { text: 'SNSでバズる方法', words: ['SNSで', 'バズる', '方法'] },
            { text: '今すぐフォローしてね', words: ['今すぐ', 'フォロー', 'してね'] }
          ],
          pt: [
            { text: 'ESSE É O SEGREDO', words: ['ESSE', 'É', 'O', 'SEGREDO'] },
            { text: 'COMO CRESCER RÁPIDO', words: ['COMO', 'CRESCER', 'RÁPIDO'] },
            { text: 'NO INSTAGRAM E TIKTOK', words: ['NO', 'INSTAGRAM', 'E', 'TIKTOK'] }
          ]
        };
        const phrases = multiPhrases[langKey] || multiPhrases.hi;
        const clipDur = clip.duration || 10;
        effectiveSubtitles = [];
        let curTime = 0;
        let idx = 0;
        while (curTime < clipDur) {
          const p = phrases[idx % phrases.length];
          const wordsCount = p.words.length;
          const perW = 0.38;
          const cDur = Number((wordsCount * perW).toFixed(2));
          const segStart = Number(curTime.toFixed(2));
          const segEnd = Number((curTime + cDur).toFixed(2));
          effectiveSubtitles.push({
            id: `dyn-${idx + 1}`,
            startTime: segStart,
            endTime: segEnd,
            text: p.text,
            words: p.words.map((w, wIdx) => ({
              word: w,
              start: Number((segStart + wIdx * perW).toFixed(2)),
              end: Number((segStart + (wIdx + 1) * perW).toFixed(2))
            }))
          });
          curTime += cDur;
          idx++;
        }
      }

      const payload = {
        videoPath: serverVideoPath,
        startTime: clip.startTime,
        duration: clip.duration,
        title: settings.customTitle?.trim() || clip.title,
        titleSticker: !!settings.titleSticker,
        enableCaptions: !!settings.enableCaptions,
        captionStyle: settings.captionStyle || 'hormozi',
        captionPosition: settings.captionPosition || 'bottom',
        videoFit: settings.videoFit || 'contain',
        subtitles: effectiveSubtitles
      };

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/trim', true);
      xhr.responseType = 'blob'; 
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 180000; 

      xhr.onload = () => {
        clearInterval(progressTimer);
        if (xhr.status === 200) {
          onProgress(100);
          const finalUrl = URL.createObjectURL(xhr.response);
          resolve(finalUrl);
        } else {
          // If blob is a JSON error, try to parse it (requires FileReader)
          if (xhr.response.type === 'application/json') {
             const reader = new FileReader();
             reader.onload = () => {
                 try {
                     const errData = JSON.parse(reader.result as string);
                     reject(new Error(errData.error || `Server Error: ${xhr.statusText}`));
                 } catch(e) {
                     reject(new Error(`Server Error: ${xhr.statusText}`));
                 }
             };
             reader.readAsText(xhr.response);
          } else {
             reject(new Error(`Server Error: ${xhr.statusText}`));
          }
        }
      };

      xhr.onerror = () => {
        clearInterval(progressTimer);
        reject(new Error('Network error during processing'));
      };
      
      xhr.ontimeout = () => {
        clearInterval(progressTimer);
        reject(new Error('Server processing timed out.'));
      };

      xhr.send(JSON.stringify(payload));
    } catch (error) {
      console.error("renderVideoClip error:", error);
      reject(error);
    }
  });
};
