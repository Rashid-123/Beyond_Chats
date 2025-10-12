
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useChatContext } from '../context/ChatContext';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function ChatSidebar() {
  const [sessions, setSessions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  
  const { getToken } = useAuth();
  const { refreshFlag } = useChatContext();
  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = await getToken({ template: 'long-live' });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/user/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setSessions(data.data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
    };
    
    fetchSessions();
  }, [getToken, refreshFlag]);
  
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <>
    
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-white fixed md:top-20 top-18 left-4 z-50 p-1 bg-[#d6a676]   rounded-full shadow-md hover:shadow-lg transition-all"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
      </button>
      
      
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
     
      <div
        ref={sidebarRef}
        className={` 
          fixed lg:static lg:top-0 left-0 h-[calc(100vh-4rem)] h-screen w-64 bg-1 border-r border-1 shadow-md flex flex-col z-40
          transition-transform duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 border-b border-b-[#f0eae2]">
          <div className="p-4 md:pt-20 pt-18 ml-17 font-semibold text-lg text-1">My Chats</div>
        </div>
        
        
        <div className="p-3 flex-1 overflow-y-auto">
          {sessions.map((session) => {
            const isActive = pathname === `/chat/${session._id}`;
            return (
              <Link key={session._id} href={`/chat/${session._id}`}>
                <div
                  className={`px-3 py-3 mb-1 cursor-pointer rounded-lg transition-colors hover:bg-[#f6efe5] ${
                    isActive 
                      ? 'bg-3 text-1 font-semibold  border-button-1 pl-3' 
                      : 'text-2 hover:bg-2'
                  }`}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                >
                  {session.title || 'Untitled Chat'}
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-1 bg-1">
          <Link href="/chat">
            <button 
              className="w-full btn-primary transition-colors"
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
            >
              + New Chat
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}