import React from 'react';

/**
 * A simple footer component with links to key pages and copyright.
 */
export default function Footer() {
  return (
    <footer className="w-full py-8 text-center text-sm text-gray-400 border-t border-gray-700 mt-12">
      <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-6">
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="mailto:support@thestrategicedge.ai" className="hover:underline">Contact Support</a>
      </div>
      <p className="mt-4">&copy; {new Date().getFullYear()} The Strategic Edge AI. All rights reserved.</p>
    </footer>
  );
}
