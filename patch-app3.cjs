const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const blobUrl = await renderVideoClip\([\s\S]*?newJob\.id\n      \);/,
  `const blobUrl = await renderVideoClip(
        clip,
        videoState.videoId || 'demo_video',
        editorSettings,
        (progress) => {
          setRenderJobs(prev => prev.map(job => 
            job.id === newJob.id ? { ...job, progress: Math.min(99, progress) } : job
          ));
        },
        newJob.id
      );`
);

fs.writeFileSync('src/App.tsx', code);
