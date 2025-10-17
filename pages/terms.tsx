import React from 'react';
import Footer from '../components/Footer';

/**
 * Terms of Service page. Replace the placeholder text with your actual terms.
 */
export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto p-8 space-y-4">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p>
          These Terms of Service govern your use of The Strategic Edge AI platform. Please
          replace this placeholder text with your actual legal terms. By using the
          service, you agree to abide by these terms.
        </p>
        <p>
          You must not misuse our services or attempt to access them in a way that
          interferes with other users. All content generated or uploaded remains the
          property of the user, and we reserve the right to remove content that
          violates these terms.
        </p>
        <p>
          If you have any questions regarding these terms, please contact
          support@thestrategicedge.ai.
        </p>
      </main>
      <Footer />
    </div>
  );
}
