'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useChatContext } from '../context/ChatContext'; // ✅ import

export default function CreateChatPopup({ pdf, onClose }) {
  const [step, setStep] = useState(1); // 1 = embedding, 2 = title input
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [title, setTitle] = useState('');

  const { getToken } = useAuth();
  const router = useRouter();
  const { refreshSidebar } = useChatContext();

  // Step 1: Embed PDF
  const handleEmbed = async () => {
    setIsEmbedding(true);
    try {
      const token = await getToken({ template: 'long-live' });
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/embed/${pdf.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStep(2);
      }
    } catch (err) {
      console.error('Embedding error:', err);
      alert('Error embedding PDF');
      onClose();
    } finally {
      setIsEmbedding(false);
    }
  };

  // Step 2: Create session
  const handleCreateSession = async () => {
    if (!title.trim()) return;
    try {
      const token = await getToken({ template: 'long-live' });
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/session`,
        { pdfId: pdf.id, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
         refreshSidebar();
        onClose();
        router.push(`/chat/${res.data.data._id}`);
      }
    } catch (err) {
      console.error('Session creation error:', err);
      alert('Error creating chat session');
    }
  };

  // Start embedding immediately when modal opens
  useState(() => {
    handleEmbed();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-4">
            <Loader2
              className={`w-10 h-10 text-[#d6a676] ${
                isEmbedding ? 'animate-spin' : ''
              }`}
            />
            <h2 className="text-lg mb-2 font-semibold">Preparing PDF for Chat...</h2>
            <p className="text-sm text-gray-500">
                <b>{pdf.fileName}</b>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Start a New Chat
            </h2>
            <p className="text-sm text-gray-500 text-center">
              PDF is ready to chat ,  Give your chat a title:
            </p>
            <input
              type="text"
              placeholder="Enter chat title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-1 border-[#f0eae2;] rounded-lg px-4 py-2 focus:outline-none  focus:ring-1 focus:ring-[#d6a676]"
            />
            <button
              onClick={handleCreateSession}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition-all cursor-pointer"
            >
              Create Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


