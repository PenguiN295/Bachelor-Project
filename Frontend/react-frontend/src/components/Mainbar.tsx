import React, { useState } from 'react';
import UserDropDown from './UserDropDown';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Users, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

import NotificationBell from './NotificationBell';
import ChatMenu from './ChatMenu';

const Mainbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} aria-label="Home">
                <Home className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                to="/communities" 
                className="flex items-center text-slate-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Communities
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <ChatMenu />
            <NotificationBell />
            <UserDropDown />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open main menu"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              to="/communities" 
              className="flex items-center px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Users className="w-5 h-5 mr-3" />
              Communities
            </Link>
            <div className="pt-4 mt-2 border-t border-border">
              <div className="px-3">
                <UserDropDown />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Mainbar;