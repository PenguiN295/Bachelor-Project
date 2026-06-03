import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, CalendarDays, History, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserDropDown: React.FC = () => {
    const { username, role, logout, photo } = useAuth();
    const navigate = useNavigate();

    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-full md:w-auto flex items-center justify-start md:justify-center gap-3 px-2 hover:bg-slate-100">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={photo || ''} alt={username || 'User'} />
                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(username)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-700 truncate max-w-[120px]">{username}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/own-events')} className="cursor-pointer">
                    <CalendarDays className="mr-2 h-4 w-4 text-slate-500" />
                    <span>My Events</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/past-events')} className="cursor-pointer">
                    <History className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Past Events</span>
                </DropdownMenuItem>
                
                {role === 'Admin' && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin/users')} className="cursor-pointer">
                            <Users className="mr-2 h-4 w-4 text-amber-500" />
                            <span className="text-amber-600 font-medium">Manage Users</span>
                        </DropdownMenuItem>
                    </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropDown;