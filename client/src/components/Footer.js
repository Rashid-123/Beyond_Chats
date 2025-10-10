'use client';

import { Brain } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-1 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Logo & Brand */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-3">
            <Brain className="w-5 h-5" style={{ color: 'var(--color-button-1)' }} />
          </div>
          <span className="text-lg font-bold text-1">
            Beyond<span style={{ color: 'var(--color-button-1)' }}>Chat</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-center text-3 text-sm max-w-md mx-auto mb-4">
          Transform your PDFs into interactive quizzes and master any subject with AI-powered learning.
        </p>

        {/* Copyright */}
        <p className="text-center text-4 text-xs">
          © {currentYear} BeyondChat. All rights reserved.
        </p>
      </div>
    </footer>
  );
}