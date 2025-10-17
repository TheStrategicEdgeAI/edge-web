import React from 'react';
import Footer from '../components/Footer';

/**
 * Privacy Policy page. Replace the placeholder text with your actual policy.
 */
export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto p-8 space-y-4">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p>
          We take your privacy seriously. This page outlines how we collect, use and
          protect your personal information. Please replace this text with your actual
          privacy policy once finalized.
        </p>
        <p>
          Our platform stores only the minimal data necessary to provide our services,
          including your email address, subscription tier, and usage metrics. We do
          not share your data with third parties except as required for payment
          processing and hosting.
        </p>
        <p>
          If you have any questions about our privacy practices, please contact
          support@thestrategicedge.ai.
        </p>
      </main>
      <Footer />
    </div>
  );
}
