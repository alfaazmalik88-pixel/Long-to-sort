import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CallToActionBanner } from '../components/CallToActionBanner';

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
          <h2 className="text-xl font-bold text-white">5. Cancellation & Refund Policy (Digital Processing)</h2>
          <p>
            Due to the immediate consumption of digital cloud compute resources upon video processing or AI rendering, transactions are considered finalized and non-refundable once digital rendering begins or completes. Requests for cancellation must be submitted prior to the commencement of computational tasks. In instances of verified technical system failures or incomplete file outputs, credits or full refunds are provided. For full details, review our <Link to="/refund-policy" className="text-indigo-400 hover:underline font-medium">Cancellation & Refund Policy</Link>.
          </p>

          <CallToActionBanner 
            title="Start Creating High-Impact Shorts"
            subtitle="Ready to grow on YouTube Shorts, Instagram Reels & TikTok? Claim your 5 free minutes trial now."
          />
        </div>
      </div>
    </div>
  );
};
