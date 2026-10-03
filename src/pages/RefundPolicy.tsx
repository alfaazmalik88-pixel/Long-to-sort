import React from 'react';
import { RotateCcw, ArrowLeft, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CallToActionBanner } from '../components/CallToActionBanner';

export const RefundPolicy = () => {
  return (
    <div className="min-h-[100dvh] bg-black text-zinc-100 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
          <RotateCcw className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-3xl font-bold">Cancellation & Refund Policy</h1>
            <p className="text-xs text-zinc-400 mt-1">Digital Processing & Service Terms</p>
          </div>
        </div>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            <strong>Effective Date:</strong> September 26, 2026
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Nature of Digital Processing Services</h2>
            <p>
              ViralClip AI ("WayinVideo") provides automated digital video transformation, AI clip generation, Part 1, Part 2 series tag rendering, and cloud computing services. Because our services involve real-time computational server processing and immediate delivery of digital content, specific conditions apply to cancellations and refunds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Cancellation Policy</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Before Processing Commences:</strong> You may cancel an export or subscription request at any time before video rendering or server compute operations begin. In such cases, full cancellation is accommodated without charges.
              </li>
              <li>
                <strong className="text-zinc-200">During / In-Flight Processing:</strong> Once the digital processing pipeline has been initiated, cloud server resources and GPU compute units are instantly allocated and cannot be paused or reversed.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Refund Handling After Digital Processing</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">Non-Refundable Upon Completion</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Once digital video processing has completed and clips/rendered files have been successfully generated and delivered, the service is deemed fully delivered. As digital compute assets are irreversibly consumed, payments for completed processing tasks are generally <strong>non-refundable</strong>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Exceptions & Technical Error Refunds</h2>
            <p>
              We stand behind the quality of our service. You are eligible for a complete refund or complimentary processing credits under the following circumstances:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-zinc-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>System / Server Failure:</strong> If a technical bug or server crash prevented your video from being rendered or delivered.</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Corrupted Output:</strong> If the processed video file is corrupted, unreadable, or missing critical audio/visual components due to an internal system fault.</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Duplicate Billing:</strong> Any accidental duplicate transactions or billing discrepancies will be refunded 100%.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. How to Request a Refund</h2>
            <p>
              If you experience any eligible technical failure, please submit a request to our support team within <strong>7 days</strong> of the incident:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">Support Email:</p>
                <a href="mailto:viralclipaihelp@gmail.com" className="text-indigo-400 font-bold hover:underline">
                  viralclipaihelp@gmail.com
                </a>
                <p className="text-xs text-zinc-500 mt-1">Please include your Transaction ID, date of request, and description/screenshot of the error.</p>
              </div>
              <a
                href="mailto:viralclipaihelp@gmail.com?subject=Refund%20Request%20-%20ViralClip%20AI"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 shrink-0"
              >
                <Mail className="w-4 h-4" /> Email Support
              </a>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Processing Timeline</h2>
            <p className="text-zinc-400">
              All refund requests are reviewed within <strong>24 to 48 hours</strong>. Once approved, the refund will be automatically initiated to your original payment method (Credit/Debit Card, UPI, Net Banking) and typically reflects in your bank account within <strong>5 to 7 business days</strong> depending on your bank or payment processor.
            </p>
          </section>

          <CallToActionBanner 
            title="Try ViralClip AI Risk-Free"
            subtitle="Start with our 5 minutes free trial. No card required, zero commitments."
          />
        </div>
      </div>
    </div>
  );
};
