import React from 'react';
import { useApp } from '../context/AppContext';
import { Car, User, LogOut, ShieldAlert, KeyRound, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'listings' | 'customer-dashboard' | 'admin-dashboard') => void;
  currentView: string;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, onOpenAuth }) => {
  const { currentUser, logout } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:bg-orange-700 transition-colors">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors">
              Ride<span className="text-orange-600">Lanka</span>
            </span>
            <span className="block text-[10px] text-gray-500 font-mono tracking-wider -mt-1 uppercase">
              Premium Marketplace
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-7">
          <button 
            onClick={() => onNavigate('home')}
            className={`font-sans text-sm font-medium transition-colors ${currentView === 'home' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('listings')}
            className={`font-sans text-sm font-medium transition-colors ${currentView === 'listings' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Find Vehicles
          </button>
          <a 
            href="#how-it-works" 
            onClick={(e) => {
              onNavigate('home');
              // Let browser scroll smoothly after state navigation
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="font-sans text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            How it Works
          </a>
          <a 
            href="https://wa.me/94723350075" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-sans text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            WhatsApp Support
          </a>
        </nav>

        {/* Access and CTA Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    currentView === 'admin-dashboard' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                  Admin Portal
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('customer-dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    currentView === 'customer-dashboard' 
                      ? 'bg-orange-50 text-orange-700 border-orange-200' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-orange-600" />
                  My Bookings
                </button>
              )}

              {/* User Summary Widget */}
              <div className="hidden lg:flex flex-col text-right mr-1">
                <span className="text-xs font-semibold text-gray-950 truncate max-w-[120px]">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {currentUser.role === 'admin' ? 'Co-ordinator' : 'Verified'}
                </span>
              </div>

              {/* Log out trigger */}
              <button
                onClick={() => {
                  logout();
                  onNavigate('home');
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-xs transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Sign In
            </button>
          )}

          {/* Quick Support Badge */}
          <a
            href="https://wa.me/94723350075?text=Hi%20RideLanka,%20I%20want%20to%20inquire%20about%20renting%20a%20car"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
          >
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
};
