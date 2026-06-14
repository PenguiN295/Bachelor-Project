import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useGlobalChat } from '../context/ChatContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import noPhoto from '../assets/nophoto.svg';

const ChatMenu: React.FC = () => {
    const { partners, partnersLoading } = useChat();
    const { openChat } = useGlobalChat();

    const totalUnread = partners.reduce((sum, p) => sum + p.unreadCount, 0);

    const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

    const formatMessageTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-600 hover:text-primary hover:bg-slate-100">
                    <MessageSquare className="h-5 w-5" />
                    {totalUnread > 0 && (
                        <span className="absolute top-1.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-white">
                            {totalUnread > 9 ? '9+' : totalUnread}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[85vh] overflow-hidden flex flex-col p-0">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-900">Messages</h3>
                </div>
                
                <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
                    {partnersLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                    ) : partners.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {partners.map(partner => (
                                <DropdownMenuItem 
                                    key={partner.id} 
                                    className={`flex items-center gap-3 p-3 cursor-pointer focus:bg-slate-50 transition-colors ${partner.unreadCount > 0 ? 'bg-primary/5' : ''}`}
                                    onClick={() => openChat(partner.id)}
                                >
                                    <Avatar className="h-10 w-10 shrink-0 border border-slate-200">
                                        <AvatarImage src={partner.photo || noPhoto} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(partner.username)}</AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className={`text-sm truncate pr-2 ${partner.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                {partner.username}
                                            </h4>
                                            {partner.lastMessageAt && (
                                                <span className={`text-[10px] shrink-0 ${partner.unreadCount > 0 ? 'text-primary font-medium' : 'text-slate-400'}`}>
                                                    {formatMessageTime(partner.lastMessageAt)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs truncate pr-2 ${partner.unreadCount > 0 ? 'font-medium text-slate-900' : 'text-slate-500'}`}>
                                                {partner.lastMessage || 'Start a conversation'}
                                            </p>
                                            {partner.unreadCount > 0 && (
                                                <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                                            )}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center flex flex-col items-center justify-center h-48">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                <MessageSquare className="w-5 h-5 text-slate-300" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">No conversations yet</p>
                            <p className="text-slate-400 text-xs mt-1">Add friends to start chatting!</p>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ChatMenu;