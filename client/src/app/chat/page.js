
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { FileText, Eye, MessageSquare, Loader } from 'lucide-react';
import PdfViewer from '@/components/PdfViewer';
import CreateChatPopup from '@/components/CreateChatPopup';

export default function PdfListPage() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [popupPdf, setPopupPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      try {
        const token = await getToken({ template: 'long-live' });
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/pdf/my-pdfs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) setPdfs(res.data.pdfs);
      } catch (err) {
        console.error('Error fetching PDFs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, [getToken]);

  return (
    <div className="h-screen bg-white overflow-y-auto pt-22">
      <div className="p-4 lg:p-8">
        <div className="mb-8 mx-auto max-w-4xl">
          <h1 className="text-3xl font-semibold mb-2 text-1">
            📚 My Uploaded PDFs
          </h1>
          <p className="text-3">Select a PDF to view or start chatting about its content</p>
        </div>

        {/* PDF List Section */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {loading ? (
            // Loading State
            <div  className="min-h-[500px] flex flex-col items-center justify-center text-center">
              <div className="flex justify-center mb-4">
                {/* <Loader className="w-12 h-12 text-button-1 animate-spin" /> */}
              </div>
              <p className="text-3 text-lg font-medium">Loading your PDFs...</p>
              <p className="text-5 text-sm mt-2">Please wait while we fetch your files</p>
            </div>
          ) : pdfs.length === 0 ? (

            <div className="min-h-[500px] flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-800">No PDFs found.</p>
              <p className="text-sm text-gray-500 mt-2">Upload a PDF to get started</p>
            </div>

          ) : (
            // PDFs List
            pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-2 border border-1 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 gap-4 hover:bg-3"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <FileText className="w-6 h-6 text-button-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-1 truncate">{pdf.fileName}</p>
                    <p className="text-sm text-4">
                      Uploaded on {new Date(pdf.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedPdf(pdf)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-button-1 hover:text-button-hover bg-1 hover:bg-3 px-4 py-2 rounded-lg font-medium transition-colors border border-border-1 cursor-pointer"
                  >
                    <Eye className="w-5 h-5" /> View
                  </button>

                  <button
                    onClick={() => setPopupPdf(pdf)}
                    className="flex-1 sm:flex-initial btn-primary flex items-center justify-center gap-2 px-4 py-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" /> Start Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PdfViewer pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}

      {/* Chat Popup Modal */}
      {popupPdf && (
        <CreateChatPopup pdf={popupPdf} onClose={() => setPopupPdf(null)} />
      )}
    </div>
  );
}