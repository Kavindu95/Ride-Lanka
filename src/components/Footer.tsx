import React from 'react';
import { Car, Send, Phone, MapPin, Mail, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gray-950 text-gray-400 font-sans border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Marketplace Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                RideLanka
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sri Lanka's premium peer-to-peer vehicle booking coordinator. We match selective clients with luxury local fleet owners to deliver unmatched hospitality.
            </p>
            <div className="text-xs text-orange-400 font-mono flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Verified cars & direct owner coordination.</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase">
              Popular Destination Areas
            </h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Colombo International Airport (CMB)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Galle and Hikkaduwa Beach Area</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Kandy / Central Highlands Hills</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Ella & Nuwara Eliya Scenic Routes</span></li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase">
              Office Details
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Level 7, Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>0723350075</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>bookings@ridelanka.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter + WhatsApp link */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase">
              Support Network
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Want to join our WhatsApp rental owners group or have a special tour requirement? Ping our management.
            </p>
            
            <a
              href="https://wa.me/94723350075?text=Hi%20RideLanka,%2520I'm%2520interested%2520in%2520listing%2520my%2520vehicle%2520or%2520booking%2520assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all uppercase tracking-wider font-mono"
            >
              Contact Owner Support
            </a>
          </div>
        </div>

        {/* Divider and copy info */}
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} RideLanka Car Marketplace. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer text-orange-500">Manual Coordinator System v4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
