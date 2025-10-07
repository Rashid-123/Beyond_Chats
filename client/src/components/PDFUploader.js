
'use client'

import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// ✅ Load PDF.js using script tag approach (more reliable for Next.js)
const usePdfJs = () => {
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already loaded
    if (window.pdfjsLib) {
      setReady(true);
      return;
    }

    // Load PDF.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;

    script.onload = () => {
      // Set worker
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setReady(true);
    };

    script.onerror = () => {
      console.error('Failed to load PDF.js');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return ready;
};

export default function PDFUploader({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const { getToken } = useAuth();

  const pdfJsReady = usePdfJs();

  const extractTextFromPDF = async (file) => {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js not loaded yet');
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const pages = []; // Store page-wise data
      const totalPages = pdf.numPages;

      // Extract text from each page
      for (let i = 1; i <= totalPages; i++) {
        setProgress(prev => ({
          ...prev,
          [file.name]: { stage: 'extracting', page: i, total: totalPages }
        }));

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');

        // Store each page separately
        pages.push({
          pageNumber: i,
          text: pageText.trim()
        });
      }

      return {
        pages, // Array of { pageNumber, text }
        pageCount: totalPages,
        success: true
      };
    } catch (error) {
      console.error('Error extracting text:', error);
      return {
        pages: [],
        pageCount: 0,
        success: false,
        error: error.message
      };
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !pdfJsReady) return;

    setUploading(true);
    const formData = new FormData();

    for (const file of files) {
      try {
        setProgress(prev => ({
          ...prev,
          [file.name]: { stage: 'parsing', page: 0, total: 0 }
        }));

        // Extract text on frontend
        const { pages, pageCount, success, error } = await extractTextFromPDF(file);

        if (!success) {
          setProgress(prev => ({
            ...prev,
            [file.name]: { stage: 'error', error }
          }));
          continue;
        }

        setProgress(prev => ({
          ...prev,
          [file.name]: { stage: 'uploading' }
        }));

        // Append file and extracted page-wise data
        formData.append('pdfs', file);
        formData.append(`pages_${file.name}`, JSON.stringify(pages));
        formData.append(`pageCount_${file.name}`, pageCount);

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        setProgress(prev => ({
          ...prev,
          [file.name]: { stage: 'error', error: error.message }
        }));
      }
    }

    try {
      const token = await getToken();
      console.log('Uploading with page-wise text extraction');

      // Upload to backend
      const response = await fetch('http://localhost:5000/api/pdf/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setProgress(prev => {
          const newProgress = { ...prev };
          files.forEach(file => {
            newProgress[file.name] = { stage: 'complete' };
          });
          return newProgress;
        });

        setTimeout(() => {
          setFiles([]);
          setProgress({});
          setUploading(false);
          if (onUploadSuccess) onUploadSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
      setUploading(false);
    }
  };

  const getProgressColor = (stage) => {
    switch (stage) {
      case 'complete': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getProgressIcon = (stage) => {
    switch (stage) {
      case 'complete': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Loader2 className="w-5 h-5 animate-spin" />;
    }
  };

  const getProgressText = (fileName) => {
    const prog = progress[fileName];
    if (!prog) return '';

    switch (prog.stage) {
      case 'parsing':
        return 'Preparing to extract text...';
      case 'extracting':
        return `Extracting text: Page ${prog.page}/${prog.total}`;
      case 'uploading':
        return 'Uploading to server...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return `Error: ${prog.error}`;
      default:
        return '';
    }
  };

  // Show loading state while PDF.js loads
  if (!pdfJsReady) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading PDF tools...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Upload PDFs with Page-wise Text Extraction
        </h2>

        <div className="mb-6">
          <label className="block w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">
                Click to select PDF files
              </p>
              <p className="text-sm text-gray-500">
                Text will be extracted page-by-page before upload
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-700">Selected Files:</h3>
            {files.map((file, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {progress[file.name] && (
                      <div className={`flex items-center gap-2 mt-2 ${getProgressColor(progress[file.name].stage)}`}>
                        {getProgressIcon(progress[file.name].stage)}
                        <span className="text-sm font-medium">
                          {getProgressText(file.name)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing & Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </>
          )}
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Text extraction happens page-by-page in your browser.
            Each page is stored separately for better citations and retrieval!
          </p>
        </div>
      </div>
    </div>
  );
}