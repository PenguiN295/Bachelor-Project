import React from 'react';
import { Bell, CircleAlert, CircleCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGlobalChat } from '../context/ChatContext';

const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();
    const { openChat } = useGlobalChat();

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Navigate based on type
        if (notification.type === 'EventSubscription' && notification.referenceId) {
            navigate(`/own-events`);
        } else if (notification.type === 'ChatMessage' && notification.actorId) {
            openChat(notification.actorId);
        } else if (notification.type === 'FriendRequest' || notification.type === 'FriendAccept') {
            navigate(`/friends`);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-600 hover:text-primary hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[85vh] overflow-hidden flex flex-col p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
                            onClick={(e) => {
                                e.preventDefault();
                                markAllAsRead();
                            }}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                
                <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {notifications.map(notification => (
                                <DropdownMenuItem 
                                    key={notification.id} 
                                    className={`flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-3 w-full">
                                        <div className={`mt-0.5 shrink-0 rounded-full p-1.5 ${!notification.isRead ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                            {!notification.isRead ? <CircleAlert className="w-4 h-4" /> : <CircleCheck className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${!notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                                {notification.message}
                                            </p>
                                            <span className="text-xs text-slate-400 mt-1 block">
                                                {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></div>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center flex flex-col items-center justify-center h-48">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                <Bell className="w-5 h-5 text-slate-300" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">You're all caught up!</p>
                            <p className="text-slate-400 text-xs mt-1">No new notifications.</p>
                        </div>
                    )}
                </div>
                
                {notifications.length > 0 && (
                    <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                        <span className="text-xs text-slate-400 font-medium">End of notifications</span>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;