'use client';

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ALLpdf({ refreshFlag }) {
    const [pdfs, setPdfs] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null); // currently opened PDF
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        setLoading(true);
        const fetchPdf = async () => {
            try {
                const token = await getToken();
                const response = await axios.get("http://localhost:5000/api/pdf/my-pdfs", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setPdfs(response.data.pdfs);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching PDFs:", err);
            }
        };

        fetchPdf();
    }, [getToken, refreshFlag]);

    const openPdfSidebar = (pdf) => {
        setSelectedPdf(pdf);
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSelectedPdf(null);
        setIsSidebarOpen(false);
    };

    if (loading) {
        return (
            <h1> Lodig pdfs</h1>
        )
    }

    return (
        <div className="relative min-h-screen bg-gray-50 p-6">
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
                            onClick={() => openPdfSidebar(pdf)}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>

            {/* Sidebar viewer */}
            {isSidebarOpen && selectedPdf && (
                <>
                    {/* Background overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                        onClick={closeSidebar}
                    ></div>

                    {/* Sidebar container */}
                    <div className="fixed top-0 right-0 w-[70%] sm:w-[50%] h-full bg-white shadow-2xl z-50 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <div>
                                <h2 className="font-semibold text-lg">{selectedPdf.fileName}</h2>
                                <p className="text-sm text-gray-500">
                                    {selectedPdf.pageCount} pages | {selectedPdf.textLength} characters
                                </p>
                            </div>
                            <button
                                onClick={closeSidebar}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* PDF Viewer (iframe) */}
                        <div className="flex-1 overflow-y-auto">
                            <iframe
                                src={selectedPdf.signedUrl}
                                title={selectedPdf.fileName}
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
