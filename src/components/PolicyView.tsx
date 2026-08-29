import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PolicyViewProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ type, onBack }) => {
  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to App</span>
        </button>

        {type === 'privacy' ? (
          <div className="prose prose-invert prose-indigo max-w-none">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-zinc-400 mb-8">Last updated: August 24, 2026</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-zinc-300 mb-4">
              At WayinVideo, we collect information to provide better services to our users. This includes:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-6 space-y-2">
              <li><strong>User Account Information:</strong> Name, email address, and authentication data via Google OAuth.</li>
              <li><strong>Uploaded Media:</strong> Video and audio files you upload to our platform for processing.</li>
              <li><strong>Usage Analytics:</strong> Information about how you interact with our application.</li>
              <li><strong>Cookies:</strong> Small data files stored on your device to improve your experience.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Third-Party Integrations</h2>
            <p className="text-zinc-300 mb-4">
              Our service interacts with several third-party APIs and services to function correctly:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-6 space-y-2">
              <li>YouTube API, TikTok API, and Instagram API for publishing and scheduling content.</li>
              <li>Google Drive for importing and exporting media.</li>
              <li>Payment Processors for handling subscriptions securely.</li>
              <li>Cloud AI Processing Services to transcribe and analyze your videos.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Storage & Security</h2>
            <p className="text-zinc-300 mb-4">
              Your video files are securely processed and temporarily stored on our secure cloud infrastructure to perform AI-based editing and captioning. <strong>We do not sell your personal data or video content to third parties.</strong> All data is encrypted in transit and at rest.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Your Data Rights (GDPR & CCPA)</h2>
            <p className="text-zinc-300 mb-4">
              Depending on your location, you may have specific rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-6 space-y-2">
              <li>The right to access the personal data we hold about you.</li>
              <li>The right to request the deletion of your personal data and uploaded files.</li>
              <li>The right to opt-out of the sale of personal information (though we do not sell your data).</li>
              <li>The right to correct inaccurate data.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Contact Us</h2>
            <p className="text-zinc-300 mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your data rights (including data deletion requests), please contact our support team at:
            </p>
            <p className="text-indigo-400 font-medium">kamarpathan0786@gmail.com</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-indigo max-w-none">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-zinc-400 mb-8">Last updated: August 24, 2026</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 mb-6">
              By accessing and using the WayinVideo application ("Service"), you accept and agree to be bound by the terms and provisions of this agreement.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p className="text-zinc-300 mb-6">
              WayinVideo is an AI-powered SaaS application that provides long-to-short video conversion, auto-captioning, and social media scheduling features.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Conduct and Content</h2>
            <p className="text-zinc-300 mb-4">
              You are solely responsible for the video and audio content you upload, process, and distribute through our Service. You agree not to upload content that:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-6 space-y-2">
              <li>Violates any third-party copyrights or trademarks.</li>
              <li>Is illegal, harmful, threatening, or offensive.</li>
              <li>Contains malware, viruses, or other harmful code.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-zinc-300 mb-6">
              You retain all ownership rights to the original content you upload. By using our Service, you grant us a temporary license to process, modify (e.g., add captions, crop), and temporarily store your content solely for the purpose of providing the Service to you.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Third-Party Services</h2>
            <p className="text-zinc-300 mb-6">
              Our Service allows you to connect to third-party platforms (such as YouTube, TikTok, and Instagram). Your use of these third-party services is governed by their respective terms of service and privacy policies. WayinVideo is not responsible for the content or practices of these third-party services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-zinc-300 mb-6">
              WayinVideo and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Information</h2>
            <p className="text-zinc-300 mb-4">
              For any questions regarding these Terms of Service, please contact us at:
            </p>
            <p className="text-indigo-400 font-medium">kamarpathan0786@gmail.com</p>
          </div>
        )}
      </div>
    </div>
  );
};
