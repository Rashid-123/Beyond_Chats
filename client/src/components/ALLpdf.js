

'use client';

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import PdfViewer from "./PdfViewer"; // ✅ import the new popup component

export default function ALLpdf({ refreshFlag }) {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get("http://localhost:5000/api/pdf/my-pdfs", {
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

  if (loading) return <h1>Loading PDFs...</h1>;

  return (
    <div className="relative min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        My PDFs ({pdfs.length})
      </h1>

      {/* PDF List */}
      <div className="grid gap-4">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="p-4 bg-white shadow rounded-lg flex justify-between items-center border"
          >
            <div>
              <h2 className="font-medium text-lg">{pdf.fileName}</h2>
              <p className="text-sm text-gray-500">
                {pdf.pageCount} pages | Status: {pdf.status}
              </p>
              <p className="text-xs text-gray-400">
                Uploaded: {new Date(pdf.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedPdf(pdf)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Popup PDF viewer */}
      {selectedPdf && (
        <PdfViewer pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}
    </div>
  );
}
