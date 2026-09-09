import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-[100dvh] bg-black text-zinc-100 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
          <ShieldAlert className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            <strong>Effective Date:</strong> September 9, 2026
          </p>
          <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
          <p>
            Your privacy is extremely important to us. All video processing (splitting, rendering, editing) is done 
            <strong> 100% locally in your browser</strong>. We do not upload, store, or share your videos to any external servers. 
            Your files never leave your device.
          </p>
          <h2 className="text-xl font-bold text-white">2. Third-Party Services</h2>
          <p>
            To keep this tool free, we use third-party advertising networks such as Monetag and Adsterra. These services may use cookies and tracking technologies to serve relevant advertisements.
          </p>
          <h2 className="text-xl font-bold text-white">3. Data Security</h2>
          <p>
            Since we do not store your video data on our servers, there is no risk of your media being leaked from our end. We take reasonable measures to protect our website infrastructure.
          </p>
          <h2 className="text-xl font-bold text-white">4. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </div>
      </div>
    </div>
  );
};
