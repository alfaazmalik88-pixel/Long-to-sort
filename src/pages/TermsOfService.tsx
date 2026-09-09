import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfService = () => {
  return (
    <div className="min-h-[100dvh] bg-black text-zinc-100 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
          <FileText className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            <strong>Effective Date:</strong> September 9, 2026
          </p>
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using ViralClip AI ("WayinVideo"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
          <h2 className="text-xl font-bold text-white">2. Use of Service</h2>
          <p>
            Our service is provided "as is" without any warranties. We are not responsible for any data loss, rendering issues, or copyright claims resulting from the use of this tool.
          </p>
          <h2 className="text-xl font-bold text-white">3. Copyright & Fair Use</h2>
          <p>
            You must own the rights or have explicit permission to edit and distribute the videos you upload to our tool. ViralClip AI does not condone copyright infringement and is strictly a utility tool for content creators. You retain full ownership of all media you process using our tool.
          </p>
          <h2 className="text-xl font-bold text-white">4. Limitation of Liability</h2>
          <p>
            In no event shall ViralClip AI be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
          </p>
        </div>
      </div>
    </div>
  );
};
