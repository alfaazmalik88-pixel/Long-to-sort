const fs = require('fs');

const newHtml = `<!doctype html>
<html lang="en">
  <head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TRWCMRX4');</script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    
    <!-- Primary Meta Tags -->
    <title>Free AI Shorts Generator | Convert Video to Shorts (No Watermark) - ViralClip AI</title>
    <meta name="title" content="Free AI Shorts Generator | Convert Video to Shorts (No Watermark) - ViralClip AI" />
    <meta name="description" content="The #1 Opus Clip alternative. Turn YouTube videos, podcasts, and long forms into viral TikToks, Instagram Reels, and YouTube Shorts instantly. 100% Free, Auto Subtitles." />
    <meta name="keywords" content="opus clip alternative free, free ai shorts generator, convert long video to shorts ai free, youtube video to tiktok converter, podcast to shorts ai, auto subtitle generator free, ai video editor no watermark, repurpose video ai" />
    <meta name="author" content="ViralClip AI" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="language" content="English" />
    
    <!-- Global Targeting (International SEO) -->
    <link rel="alternate" hreflang="en-US" href="https://viralclipai.in/" />
    <link rel="alternate" hreflang="en-GB" href="https://viralclipai.in/" />
    <link rel="alternate" hreflang="en-CA" href="https://viralclipai.in/" />
    <link rel="alternate" hreflang="en-AU" href="https://viralclipai.in/" />
    <link rel="alternate" hreflang="x-default" href="https://viralclipai.in/" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://viralclipai.in/" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://viralclipai.in/" />
    <meta property="og:title" content="Free AI Shorts Generator | Best Opus Clip Alternative" />
    <meta property="og:description" content="Turn long videos into viral TikToks, Reels, and Shorts for free. No watermarks, auto-captions included." />
    <meta property="og:image" content="https://viralclipai.in/logo.png" />
    <meta property="og:site_name" content="ViralClip AI" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://viralclipai.in/" />
    <meta property="twitter:title" content="Free AI Shorts Generator | Best Opus Clip Alternative" />
    <meta property="twitter:description" content="Turn long videos into viral TikToks, Reels, and Shorts for free. No watermarks, auto-captions included." />
    <meta property="twitter:image" content="https://viralclipai.in/logo.png" />
    
    <!-- Schema.org Markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ViralClip AI",
      "alternateName": "ViralClip Free AI Shorts Generator",
      "url": "https://viralclipai.in/",
      "logo": "https://viralclipai.in/logo.png",
      "description": "Free AI software to convert long YouTube videos and podcasts into viral short clips for YouTube Shorts, TikTok, and Instagram Reels with auto-captions. A free alternative to Opus Clip.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Windows, macOS, Android, iOS, ChromeOS",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "120"
      },
      "featureList": [
        "AI Video Cropping",
        "Long video to Shorts converter",
        "Podcast to TikTok",
        "Auto Captions & Subtitles",
        "No Watermark",
        "Opus Clip Alternative Free"
      ]
    }
    </script>
    
    <!-- MONETAG AD SCRIPT -->
    <meta name="monetag" content="7e4922ca14c89b84160735c55aec0fd1">
      
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TRWCMRX4"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <!-- ADSTERRA SCRIPT (Social Bar) -->
    <script type="text/javascript" data-cfasync="false" async="async" src="//pl31243129.profitableratecpmnetwork.com/ae/26/ae/ae26ae9ff287315edb888a1af08e830f.js"></script>
  </body>
</html>`;

fs.writeFileSync('index.html', newHtml);
console.log("Updated index.html for Global SEO");
