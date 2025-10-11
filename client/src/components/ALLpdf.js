

'use client';

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import PdfViewer from "./PdfViewer";
import CreateQuizPopup from "./CreateQuizPopup";

// ✅ Lucide Icons
import {
  FileText,
  BookOpen,
  Clock,
  Eye,
  Sparkles,
  LibraryBig,
} from "lucide-react";

export default function ALLpdf({ refreshFlag }) {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/pdf/my-pdfs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPdfs(response.data.pdfs);
      } catch (err) {
        console.error("Error fetching PDFs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPdf();
  }, [getToken, refreshFlag]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 rounded-full animate-spin mb-4"
          style={{
            borderColor: "var(--color-button-1)",
            borderTopColor: "transparent",
          }}
        ></div>
        <p className="text-3 text-sm sm:text-base">Loading your PDFs...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-1 mb-2 flex items-center gap-2">
          <LibraryBig className="w-6 h-6 text-1" />
          Your Library
        </h2>
        <p className="text-3 text-sm sm:text-base">
          {pdfs.length === 0
            ? "No PDFs uploaded yet. Start by uploading your first document!"
            : `${pdfs.length} ${
                pdfs.length === 1 ? "document" : "documents"
              } ready for quiz generation`}
        </p>
      </div>

      {/* Empty State */}
      {pdfs.length === 0 ? (
        <div className="bg-2 border-2 border-dashed border-1 rounded-xl p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto">
            <LibraryBig className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-2 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-2 mb-2">
              No PDFs Yet
            </h3>
            <p className="text-3 text-sm sm:text-base">
              Upload your first PDF to start creating interactive quizzes
            </p>
          </div>
        </div>
      ) : (
        /* PDF Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-white border border-1 rounded-xl p-4 sm:p-6 hover:shadow-sm"
            >
              {/* PDF Icon & Info */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div
                  className="text-3 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-background-3)" }}
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-1 mb-1 truncate">
                    {pdf.fileName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {pdf.pageCount} pages
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(pdf.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 ">
                <button
                  onClick={() => {
                    setSelectedPdf(pdf);
                    setShowQuizPopup(true);
                  }}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Quiz
                </button>

                <button
                  onClick={() => setSelectedPdf(pdf)}
                  className="flex-1 px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base border-2 border-1 text-2 hover:bg-3 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  View PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewer Popup */}
      {selectedPdf && !showQuizPopup && (
        <PdfViewer pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}

      {/* Create Quiz Popup */}
      {showQuizPopup && selectedPdf && (
        <CreateQuizPopup
          pdf={selectedPdf}
          onClose={() => {
            setShowQuizPopup(false);
            setSelectedPdf(null);
          }}
        />
      )}
    </div>
  );
}
