import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, X, Loader2, MessageSquare } from 'lucide-react';
import noPhoto from '../assets/nophoto.svg';

interface FloatingChatWindowProps {
    partnerId: string;
    onClose: () => void;
}

const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({ partnerId, onClose }) => {
    const { userId } = useAuth();
    const { partners, conversation, conversationLoading, sendMessage, isSending, markAsRead } = useChat(partnerId);
    
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activePartner = partners.find(p => p.id === partnerId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    useEffect(() => {
        if (partnerId && activePartner && activePartner.unreadCount > 0) {
            markAsRead();
        }
    }, [partnerId, activePartner, markAsRead]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !partnerId) return;
        
        sendMessage(messageInput.trim());
        setMessageInput('');
    };

    const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!activePartner) return null;

    return (
        <div className="fixed z-50 sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] sm:rounded-2xl inset-0 w-full h-full sm:border border-slate-200 shadow-2xl flex flex-col bg-white overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-5">
            {/* Header */}
            <div className="h-16 px-4 bg-primary text-primary-foreground flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border border-primary-foreground/20">
                        <AvatarImage src={activePartner.photo || noPhoto} className="object-cover bg-white" />
                        <AvatarFallback className="bg-white text-primary font-bold">{getInitials(activePartner.username)}</AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                        <h3 className="font-bold leading-tight truncate">{activePartner.username}</h3>
                        <div className="text-xs font-medium opacity-80">Chat</div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-white rounded-full shrink-0" onClick={onClose}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50 relative">
                {conversationLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : conversation.length > 0 ? (
                    <div className="flex flex-col space-y-4 pb-2">
                        {conversation.map((msg, index) => {
                            const isMe = msg.senderId === userId;
                            const showDateHeader = index === 0 || 
                                new Date(msg.createdAt).toDateString() !== new Date(conversation[index - 1].createdAt).toDateString();

                            return (
                                <React.Fragment key={msg.id}>
                                    {showDateHeader && (
                                        <div className="flex justify-center my-4">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">
                                                {new Date(msg.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 relative shadow-sm ${
                                            isMe 
                                                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                                        }`}>
                                            <p className="whitespace-pre-wrap break-words text-[15px] leading-snug">{msg.content}</p>
                                            <div className={`text-[10px] mt-1 text-right font-medium ${isMe ? 'text-primary-foreground/70' : 'text-slate-400'}`}>
                                                {formatMessageTime(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-slate-200/50 flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Say hello!</h3>
                        <p className="text-slate-500 text-sm">Send a message to start the conversation with {activePartner.username}.</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <Input 
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="flex-1 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-primary/20 min-h-[44px]"
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        className="h-11 w-11 rounded-xl shrink-0 bg-primary hover:bg-primary/90" 
                        disabled={!messageInput.trim() || isSending}
                    >
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default FloatingChatWindow;