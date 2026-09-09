const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/components/SeoSection.tsx', 'utf8');

content = "import { Link } from 'react-router-dom';\n" + content;

content = content.replace(
  '<button className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">\n            <ShieldCheck className="w-6 h-6 text-zinc-500" />\n            <div className="text-center">\n              <div className="text-sm font-bold text-zinc-300">Privacy Policy</div>\n              <div className="text-[10px] text-zinc-500">Data & GDPR</div>\n            </div>\n          </button>',
  '<Link to="/privacy-policy" className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">\n            <ShieldCheck className="w-6 h-6 text-zinc-500" />\n            <div className="text-center">\n              <div className="text-sm font-bold text-zinc-300">Privacy Policy</div>\n              <div className="text-[10px] text-zinc-500">Data & GDPR</div>\n            </div>\n          </Link>'
);

content = content.replace(
  '<button className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">\n            <FileText className="w-6 h-6 text-zinc-500" />\n            <div className="text-center">\n              <div className="text-sm font-bold text-zinc-300">Terms of Service</div>\n              <div className="text-[10px] text-zinc-500">Usage rules</div>\n            </div>\n          </button>',
  '<Link to="/terms-of-service" className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">\n            <FileText className="w-6 h-6 text-zinc-500" />\n            <div className="text-center">\n              <div className="text-sm font-bold text-zinc-300">Terms of Service</div>\n              <div className="text-[10px] text-zinc-500">Usage rules</div>\n            </div>\n          </Link>'
);

content = content.replace(
  '<button className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">\n            <Mail className="w-6 h-6 text-zinc-500" />\n            <div className="text-center">\n              <div className="text-sm font-bold text-zinc-300">Contact Support</div>\n              <div className="text-[10px] text-zinc-500">kamarpathan0786@gmail.com</div>\n            </div>\n          </button>',
  '<Link to="/contact" className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 transition-colors">\n            <Mail className="w-6 h-6 text-zinc-500" />\n            <div className="text-center">\n              <div className="text-sm font-bold text-zinc-300">Contact Support</div>\n              <div className="text-[10px] text-zinc-500">kamarpathan0786@gmail.com</div>\n            </div>\n          </Link>'
);

fs.writeFileSync('/app/applet/src/components/SeoSection.tsx', content);
