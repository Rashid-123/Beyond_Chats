

'use client';

import ChatSidebar from '@/components/ChatSidebar';
import { ChatProvider } from '@/context/ChatContext';

export default function ChatLayout({ children }) {
  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Hidden on mobile by default, visible on lg+ */}
        <ChatSidebar />

        {/* Main content area - Full width on mobile, adjusted on lg+ */}
        <div className="flex-1 w-full lg:w-auto overflow-y-auto">
          {children}
        </div>
      </div>
    </ChatProvider>
  );
}