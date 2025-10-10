'use client';

import { useEffect } from "react";
import { BookOpen, Calendar, X, ExternalLink } from "lucide-react"; // ✅ Import Lucide icons

export default function PdfViewer({ pdf, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!pdf) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-1 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden relative animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 sm:p-6 border-b border-1 bg-2 relative">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg sm:text-xl text-1 truncate mb-1">
                {pdf.fileName}
              </h2>
              <div className="flex items-center gap-3 text-sm text-3">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {pdf.pageCount} pages
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(pdf.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 w-10 h-10 rounded-full hover:bg-3 flex items-center justify-center text-3 hover:text-1 transition-all duration-200"
              aria-label="Close PDF viewer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 relative bg-3">
            <iframe
              src={pdf.signedUrl}
              title={pdf.fileName}
              className="w-full h-full border-none"
              loading="lazy"
            />
            
            {/* Loading overlay (optional) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-2 px-4 py-2 rounded-lg shadow-lg opacity-0 animate-pulse">
                <p className="text-3 text-sm">Loading PDF...</p>
              </div>
            </div>
          </div>

          {/* Footer (info bar) */}
          <div className="px-4 sm:px-6 py-3 border-t border-1 bg-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-3">
              <span>Viewing in browser</span>
              <button
                onClick={() => window.open(pdf.signedUrl, "_blank")}
                className="flex items-center gap-1 text-4 hover:text-1 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
