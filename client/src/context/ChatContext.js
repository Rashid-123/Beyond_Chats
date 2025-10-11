'use client';
import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Function to trigger sidebar refresh
  const refreshSidebar = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <ChatContext.Provider value={{ refreshFlag, refreshSidebar }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
