const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
const replacement = `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ViralClip AI",
      "operatingSystem": "All",
      "applicationCategory": "MultimediaApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "120"
      }
    }
    </script>`;

content = content.replace(regex, replacement);
fs.writeFileSync('index.html', content);
console.log("Replaced Schema.org script");
