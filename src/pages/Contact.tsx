import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Contact = () => {
  return (
    <div className="min-h-[100dvh] bg-black text-zinc-100 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
          <Mail className="w-8 h-8 text-rose-400" />
          <h1 className="text-3xl font-bold">Contact Us</h1>
        </div>
        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            Have a question, feedback, or need support? We're here to help!
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Email Support</h2>
              <p className="text-zinc-400 mb-4">
                You can reach out to us directly via email. We aim to respond to all inquiries within 24-48 hours.
              </p>
              <a href="mailto:kamarpathan0786@gmail.com" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-lg transition-colors">
                kamarpathan0786@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
