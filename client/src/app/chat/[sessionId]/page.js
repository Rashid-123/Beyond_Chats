

'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import MessageBubble from '@/components/MessageBubble';
import { useAuth, useUser } from '@clerk/nextjs';
import PdfViewer from '@/components/PdfViewer';
import { FileText, Send, MessageSquare } from 'lucide-react';

export default function ChatSessionPage() {
    const { sessionId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false); // for sending message
    const [initialLoading, setInitialLoading] = useState(true); // for fetching messages initially
    const [pdf, setPdf] = useState(null);
    const [showPdf, setShowPdf] = useState(false);
    const chatEndRef = useRef(null);
    const { getToken } = useAuth();
    const { user } = useUser();

    // Fetch messages (initial)
    useEffect(() => {
        const fetchMessages = async () => {
            setInitialLoading(true);
            try {
                const token = await getToken({ template: 'long-live' });
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/chat/session/${sessionId}/history`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.success) setMessages(data.data);
            } catch (err) {
                console.error('Error fetching messages:', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchMessages();
    }, [sessionId, getToken]);

    // Fetch PDF info
    const fetchPdf = async () => {
        try {
            const token = await getToken({ template: 'long-live' });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/pdf/${sessionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.success) setPdf(data.pdf);
        } catch (err) {
            console.error('Error fetching PDF:', err);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: 'user', message: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = await getToken({ template: 'long-live' });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/session/${sessionId}/message`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ message: input }),
                }
            );
            const data = await res.json();
            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', message: data.data.message },
                ]);
            }
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setLoading(false);
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleOpenPdf = async () => {
        if (!pdf) await fetchPdf();
        setShowPdf(true);
    };

    return (
        <div className="flex flex-col h-screen bg-white pt-25 pb-18">
            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 pb-32">
                {/* Show only when fetching initial data */}
                {initialLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                        Loading messages...
                    </div>
                ) : messages.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <h2 className="text-3xl font-medium text-1 mb-1">
                            Welcome back,  <span className="text-[#d6a676]">{user?.firstName} !</span>
                        </h2>

                        <p className="text-3 text-md mb-6">
                            Ready to explore your documents?
                        </p>

                        <p className="text-4 text-sm max-w-xs">
                            Ask questions about your PDF or have a conversation about its content
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <MessageBubble key={i} role={msg.role} message={msg.message} />
                        ))}
                        {loading && (
                            <p className="text-gray-400 italic text-center">Thinking...</p>
                        )}
                        <div ref={chatEndRef}></div>
                    </>
                )}
            </div>

            {/* Input bar */}
            <div className="fixed bottom-5 left-0 lg:left-64 right-0 py-4 px-4 lg:px-6 z-30">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center bg-2 shadow-sm rounded-xl px-3 py-2 gap-2 border border-[#f3e4d6]">
                        <input
                            type="text"
                            className="flex-1 border-0 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none "
                            placeholder="Ask something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />

                        {/* Send button */}
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="btn-primary px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Send className="w-5 h-5" />
                        </button>

                        {/* PDF Button */}
                        <button
                            onClick={handleOpenPdf}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                            title="View PDF"
                        >
                            <FileText className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Modal */}
            {showPdf && pdf && (
                <PdfViewer pdf={pdf} onClose={() => setShowPdf(false)} />
            )}
        </div>
    );
}
