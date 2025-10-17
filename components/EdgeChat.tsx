import React, { useState } from 'react';

/**
 * EdgeChat is a simple chat bubble that lives on every page. When clicked
 * it toggles a small panel with quick links and FAQs about the platform.
 * This is a placeholder for the EDGE‑icator assistant described in the
 * spec. A future version could hook into the evaluate/design APIs.
 */
export default function EdgeChat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat panel */}
      {open && (
        <div className="mb-3 w-72 bg-gray-900 text-white rounded-lg shadow-lg p-4 space-y-2">
          <h3 className="text-lg font-semibold">Need help?</h3>
          <p className="text-sm">I'm the EDGE‑icator. Here are some things I can help with:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <a href="/pricing" className="text-edge-gold hover:underline">What’s included in each plan?</a>
            </li>
            <li>
              <a href="/evaluate" className="text-edge-gold hover:underline">Start an Evaluate session</a>
            </li>
            <li>
              <a href="/design" className="text-edge-gold hover:underline">Design a strategy</a>
            </li>
            <li>
              <a href="/signup" className="text-edge-gold hover:underline">How do I sign up?</a>
            </li>
          </ul>
        </div>
      )}
      {/* Chat bubble button */}
      <button
        className="edge-btn flex items-center justify-center rounded-full h-12 w-12"
        style={{ borderRadius: '50%' }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle EDGE‑icator"
      >
        {open ? '×' : '?'}
      </button>
    </div>
  );
}