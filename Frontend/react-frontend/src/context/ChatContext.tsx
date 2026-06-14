import React, { createContext, useContext, useState } from 'react';
import FloatingChatWindow from '../components/FloatingChatWindow';
import { useAuth } from './AuthContext';

interface ChatContextType {
    openChat: (userId: string) => void;
    closeChat: () => void;
    activeChatId: string | null;
}

const ChatContext = createContext<ChatContextType>({} as any);

export const ChatProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { token } = useAuth();
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    return (
        <ChatContext.Provider value={{ 
            openChat: setActiveChatId, 
            closeChat: () => setActiveChatId(null), 
            activeChatId 
        }}>
            {children}
            {token && activeChatId && (
                <FloatingChatWindow 
                    partnerId={activeChatId} 
                    onClose={() => setActiveChatId(null)} 
                />
            )}
        </ChatContext.Provider>
    );
}

export const useGlobalChat = () => useContext(ChatContext);