'use client';
import { useEffect } from "react";
export default function PdfViewer({ pdf, onClose }) {


 useEffect(() => {
    document.body.style.overflow = "hidden"; // ❌ disable scroll
    return () => {
      document.body.style.overflow = "auto"; // ✅ re-enable scroll when closed
    };
  }, []);

  if (!pdf) return null;

  return (
    <>
 
       <div
        className="fixed inset-0 bg-black/10 bg-opacity-50 z-60"
        onClick={onClose}
      />

      {/* Center popup container */}
      <div className="fixed inset-0 flex items-center justify-center z-100">
        <div className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] h-[90vh] flex flex-col overflow-hidden relative">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <div>
              <h2 className="font-semibold text-lg">{pdf.fileName}</h2>
              <p className="text-sm text-gray-500">
                {pdf.pageCount} pages 
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold curson pointer"
            >
              ✕
            </button>
          </div>

          {/* PDF viewer */}
          <div className="flex-1">
            <iframe
              src={pdf.signedUrl}
              title={pdf.fileName}
              className="w-full h-full border-none"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
