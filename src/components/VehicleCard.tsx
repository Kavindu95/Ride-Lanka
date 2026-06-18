import React from 'react';
import { Vehicle } from '../types';
import { Users, Fuel, Sparkles, SlidersHorizontal, CheckCircle2, ShieldOff, MessageCircleCode } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicleId: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  // Format price in clean LKR format
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* Visual Header / Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 shrink-0">
        <img
          src={vehicle.main_image}
          alt={vehicle.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category sticker */}
        <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-extrabold text-orange-950 uppercase tracking-wider shadow-xs">
          {vehicle.category}
        </span>

        {/* Availability Badge */}
        <span className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
          vehicle.available 
            ? 'bg-emerald-500/90 text-white' 
            : 'bg-rose-500/90 text-white'
        }`}>
          {vehicle.available ? 'Ready to Coordinate' : 'Booked out'}
        </span>
      </div>

      {/* Card Content body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Main Titles */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-display font-bold text-gray-900 group-hover:text-orange-600 transition-colors text-lg tracking-tight leading-snug">
              {vehicle.name}
            </h3>
          </div>

          {/* Core Spec Attributes Horizontal Row */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-500 font-mono mb-4">
            <span className="flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              {vehicle.transmission}
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-gray-400" />
              {vehicle.fuel_type}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              {vehicle.seats} Seats
            </span>
          </div>

          {/* Quick manual coordinator hint statement */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 font-sans">
            {vehicle.description}
          </p>
        </div>

        {/* Pricing tag and View details CTA */}
        <div className="pt-4 border-t border-gray-100 flex items-end justify-between gap-2 mt-auto">
          <div>
            <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">
              Daily Rental Price
            </span>
            <span className="font-display font-black text-xl text-gray-950 tracking-tight">
              {formatPrice(vehicle.price_per_day)}
            </span>
            <span className="text-xs font-semibold text-gray-500 font-mono">
              /day
            </span>
          </div>

          <button
            onClick={() => onSelect(vehicle.id)}
            className="px-4 py-2 bg-gray-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-orange-500/10 transition-all uppercase tracking-wider shrink-0 cursor-pointer"
          >
            Details & Form
          </button>
        </div>
      </div>
    </div>
  );
};
