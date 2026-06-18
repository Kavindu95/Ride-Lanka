import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { VehicleCard } from './components/VehicleCard';
import { BookingForm } from './components/BookingForm';
import { Testimonials } from './components/Testimonials';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPortal } from './components/AdminPortal';
import { 
  Car, Calendar, Search, MapPin, Sparkles, Navigation, 
  MessageSquare, UserCheck, ShieldCheck, KeyRound, Check, HelpCircle, Info, ChevronRight, Fuel, SlidersHorizontal, Users, RefreshCw
} from 'lucide-react';

// Main App Inner Component to consume Context
const AppContent: React.FC = () => {
  const { vehicles, currentUser, logout, supabaseError, clearDbError } = useApp();
  
  // Navigation View modes: 'home' | 'listings' | 'details' | 'customer-dashboard' | 'admin-dashboard'
  const [currentView, setCurrentView] = useState<'home' | 'listings' | 'details' | 'customer-dashboard' | 'admin-dashboard'>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Search & Filter state variables
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(60000);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Home Page Location Search state
  const [homeLocation, setHomeLocation] = useState<string>('Bandaranaike Intl Airport (CMB)');
  const [homePickup, setHomePickup] = useState<string>('');
  const [homeReturn, setHomeReturn] = useState<string>('');

  const handleHomeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to listings and apply home filters
    setCurrentView('listings');
  };

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setCurrentView('details');
    // Scroll page to top to make viewing detail seamless
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesTransmission = selectedTransmission === 'All' || v.transmission === selectedTransmission;
    const matchesFuel = selectedFuel === 'All' || v.fuel_type === selectedFuel;
    const matchesPrice = v.price_per_day <= maxPrice;

    return matchesSearch && matchesCategory && matchesTransmission && matchesFuel && matchesPrice;
  }).sort((a,b) => {
    if (sortBy === 'price-low') return a.price_per_day - b.price_per_day;
    if (sortBy === 'price-high') return b.price_per_day - a.price_per_day;
    return 0; // standard default
  });

  // Get active selected vehicle detail object
  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId);
  
  // Keep track of active detail image gallery state
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Render specifications icon helpers
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans select-none antialiased">
      
      {/* Header bar component */}
      <Header 
        onNavigate={(view) => {
          if (view === 'listings') {
            // Reset filters
            setSelectedCategory('All');
            setSelectedTransmission('All');
            setSelectedFuel('All');
          }
          setCurrentView(view as any);
        }}
        currentView={currentView}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Database Warning / RLS Informative Banner */}
      {supabaseError && (
        <div className="bg-amber-50 border-y border-amber-200 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide font-mono flex items-center gap-1.5 wrap">
                  <span>Supabase Database Notice (RLS Rule Block)</span>
                  <span className="text-[10px] text-amber-700 font-sans normal-case font-normal">(Fallback is safely active)</span>
                </p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  The action succeeded locally, but Supabase reported a save policy conflict: 
                  <span className="font-mono text-pink-700 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded text-[11px] select-all ml-1 break-word font-semibold inline-block">{supabaseError}</span>
                </p>
                <div className="text-[11px] text-amber-600 font-medium mt-1.5 leading-relaxed">
                  💡 <strong>To allow public write/update with your Anon Key and fix this:</strong> Run the following SQL queries in your <strong>Supabase SQL Editor</strong> to disable Row-Level Security on your tables:
                  <code className="block bg-slate-900 text-slate-100 rounded-lg p-3 mt-1.5 font-mono text-[10.5px] select-all whitespace-pre leading-relaxed overflow-x-auto border border-slate-800 max-w-full">
                    ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;{"\n"}
                    ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;{"\n"}
                    ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
                  </code>
                </div>
              </div>
            </div>
            <button 
              onClick={clearDbError}
              className="text-amber-500 hover:text-amber-800 hover:bg-amber-100 px-2.5 py-1 rounded-md font-mono text-[10px] font-bold border border-amber-300 shrink-0 cursor-pointer transition-colors"
              title="Acknowledge and Hide warning for now"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: HOME PAGE ROUTE */}
      {currentView === 'home' && (
        <main className="flex-1">
          
          {/* Main Hero landing block */}
          <section className="relative bg-gray-950 text-white py-20 sm:py-28 overflow-hidden">
            {/* Background Image of beautiful Sri Lanka roads */}
            <div className="absolute inset-0 z-0 opacity-25">
              <img 
                src="https://images.unsplash.com/photo-1549399542-7cd3cf17a35b?auto=format&fit=crop&w=1800&q=80" 
                alt="Sri Lanka Coast" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
              
              {/* Bold premium pitch introduction */}
              <div className="max-w-3xl space-y-5 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-orange-400">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Sri Lanka's Custom Peer-To-Peer Booking Agent</span>
                </div>
                
                <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight leading-tight">
                  Premium Vehicle Fleet, <br className="hidden sm:inline" />
                  Coordinated for you <span className="text-orange-500">Privately</span>.
                </h1>
                
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                  No instant checkout uncertainties or standard corporate rental delays. Submit a request, and we manually verify real-time owner availability through active Colombo owner groups.
                </p>
              </div>

              {/* Float Search Parameter block */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-gray-900 shadow-2xl max-w-5xl border border-gray-100">
                <form onSubmit={handleHomeSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  
                  {/* Location Selector */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                      Pickup Hub Location
                    </label>
                    <div className="relative">
                      <select
                        value={homeLocation}
                        onChange={(e) => setHomeLocation(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 cursor-pointer appearance-none"
                      >
                        <option value="Bandaranaike Intl Airport (CMB)">Bandaranaike Intl Airport (CMB)</option>
                        <option value="Colombo 03 (Colpetty)">Colombo 03 (Colpetty)</option>
                        <option value="Negombo Beach Boulevard">Negombo Beach Boulevard</option>
                        <option value="Galle Fort Clock Tower">Galle Fort Clock Tower</option>
                      </select>
                      <MapPin className="w-4 h-4 text-orange-500 absolute left-2.5 top-2.5 shrink-0" />
                    </div>
                  </div>

                  {/* Pickup dates */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                      Desired Pickup Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={homePickup}
                        onChange={(e) => setHomePickup(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 cursor-pointer"
                      />
                      <Calendar className="w-4 h-4 text-orange-500 absolute left-2.5 top-2.5 shrink-0" />
                    </div>
                  </div>

                  {/* Return dates */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                      Expected Return Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={homeReturn}
                        onChange={(e) => setHomeReturn(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 cursor-pointer"
                      />
                      <Calendar className="w-4 h-4 text-orange-500 absolute left-2.5 top-2.5 shrink-0" />
                    </div>
                  </div>

                  {/* Trigger call */}
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-orange-500/10 shrink-0 cursor-pointer"
                    >
                      Search Marketplace
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </section>

          {/* Quick Category Pills selector */}
          <section className="py-12 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                Browse Listed Fleet Segments
              </span>
              
              <div className="flex flex-wrap justify-center gap-3">
                {['All', 'Economy', 'Sedan', 'Minivan', 'Van', 'SUV', 'Luxury Vehicles'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentView('listings');
                    }}
                    className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-full font-display font-semibold text-xs tracking-tight text-gray-900 transition-all cursor-pointer"
                  >
                    {cat === 'All' ? '🌐 View All Listings' : cat === 'Economy' ? '🚗 Economy & Budget' : cat === 'Sedan' ? '🚘 Prime Sedan Class' : cat === 'Minivan' ? '🚙 Premium Minivan' : cat === 'Van' ? '🚐 Passenger Van' : cat === 'SUV' ? '⛰️ Tough Road SUV' : '✨ Elite Luxury Fleet'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Vehicles Grid Row */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
              <div>
                <span className="text-xs font-extrabold text-orange-600 font-mono tracking-wider uppercase block">
                  Select hand-picked models
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight mt-1">
                  Featured Vehicles Built for Sri Lankan Roads
                </h2>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentView('listings');
                }}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                Browse directory <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grid list of vehicles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vehicles.slice(0, 3).map((veh) => (
                <VehicleCard
                  key={veh.id}
                  vehicle={veh}
                  onSelect={handleSelectVehicle}
                />
              ))}
            </div>
          </section>

          {/* Business Model Explanation Block */}
          <section id="how-it-works" className="py-16 bg-gray-900 text-white overflow-hidden text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <span className="text-xs font-extrabold text-orange-400 font-mono tracking-widest uppercase block">
                  A Safe & Transparent Marketplace
                </span>
                <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  No instant payment risk. <br />
                  Manually coordinated for peace of mind.
                </h3>
                
                <p className="text-sm text-gray-300 leading-relaxed font-sans">
                  Unlike traditional platforms that reserve vehicles algorithmically, RideLanka is a custom concierge service matching buyers with registered private vehicle owners.
                </p>

                {/* Vertical Step indicators */}
                <div className="space-y-4 pt-2">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-orange-600/25 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <span className="block font-bold text-white text-sm">Submit Booking Request</span>
                      <span className="block text-xs text-gray-400 mt-0.5">Choose checkout dates & pick up terminal. Securely upload identification files for credential reviews.</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-orange-600/25 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <span className="block font-bold text-white text-sm">Manual Partner Verification</span>
                      <span className="block text-xs text-gray-400 mt-0.5">We dispatch dates in real-time private driver & agency groups on WhatsApp to verify actual physical status.</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-orange-600/25 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <span className="block font-bold text-white text-sm">Direct WhatsApp Connect</span>
                      <span className="block text-xs text-gray-400 mt-0.5">Once availability is locked, we construct a coordinated chat thread. Deal finalized securely offline on pickup.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic container summarizing values */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                <span className="text-xs font-extrabold font-mono text-orange-400 uppercase tracking-widest block">
                  Marketplace Mechanics Summary
                </span>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="border border-white/5 bg-white/2 p-4 rounded-xl space-y-1">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    <span className="block text-sm font-bold mt-1 text-white">WhatsApp Match</span>
                    <span className="block text-[11px] text-gray-400">Coordinated manually through verified vehicle owners groups.</span>
                  </div>

                  <div className="border border-white/5 bg-white/2 p-4 rounded-xl space-y-1">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <span className="block text-sm font-bold mt-1 text-white">Owner Vetted</span>
                    <span className="block text-[11px] text-gray-400">Owner confirms the vehicle status before final group pre-auth.</span>
                  </div>

                  <div className="border border-white/5 bg-white/2 p-4 rounded-xl space-y-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="block text-sm font-bold mt-1 text-white">Secure Copy</span>
                    <span className="block text-[11px] text-gray-400">NIC/Driving Licences held privately. Instantly shredded upon checkout closure.</span>
                  </div>

                  <div className="border border-white/5 bg-white/2 p-4 rounded-xl space-y-1">
                    <Info className="w-5 h-5 text-emerald-400" />
                    <span className="block text-sm font-bold mt-1 text-white">Completely Free Match</span>
                    <span className="block text-[11px] text-gray-400">No upfront setup fees. Connect directly with owners offline.</span>
                  </div>
                </div>

                <div className="p-4 bg-orange-600 rounded-xl flex items-center justify-between text-white text-xs font-bold uppercase tracking-wider">
                  <span>No upfront payment gateways</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </section>

          {/* Testimonial Section component */}
          <Testimonials />

        </main>
      )}

      {/* VIEW 2: VEHICLE LISTING DIRECTORY ROUTE */}
      {currentView === 'listings' && (
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left font-sans">
          
          {/* Header titles */}
          <div className="mb-8">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight">
              Explore Our Sri Lankan Rental Fleet Catalog
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Filter by vehicle transmission, category fuel, or seating limits, and submit a 5-day advance inquiry check.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column: Responsive Filters Controls */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-xs space-y-5">
                
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-gray-950 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                    Filters
                  </span>
                  
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedTransmission('All');
                      setSelectedFuel('All');
                      setMaxPrice(60000);
                    }}
                    className="text-[10px] text-orange-600 hover:text-orange-700 font-bold uppercase font-mono tracking-wider cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Search Text Input */}
                <div className="space-y-1 text-xs">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
                    Search Model
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="E.g., Prado, Mercedes..."
                      className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Segment categories */}
                <div className="space-y-1.5 text-xs text-left">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
                    Vehicle Segment
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Economy">Economy</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Van">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury Vehicles">Luxury Vehicles</option>
                  </select>
                </div>

                {/* Transmission modes options */}
                <div className="space-y-1.5 text-xs text-left">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
                    Transmission Mode
                  </label>
                  <div className="flex gap-2">
                    {['All', 'Automatic', 'Manual'].map((tx) => (
                      <button
                        key={tx}
                        onClick={() => setSelectedTransmission(tx)}
                        className={`flex-1 py-1.5 text-center text-[10px] font-extrabold rounded bg-gray-50 border transition-all ${selectedTransmission === tx ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-gray-600 hover:bg-gray-100 border-gray-200'}`}
                      >
                        {tx}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel drives selection list */}
                <div className="space-y-1.5 text-xs text-left">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
                    Fuel Drive Type
                  </label>
                  <select
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                    className="w-full p-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Fuels</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid Synergy</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                {/* Range constraints */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
                    <span>Daily Budget Cap</span>
                    <span className="text-orange-600 font-bold">{formatPrice(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="60000"
                    step="2000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-ew-resize"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                    <span>LKR 10k/day</span>
                    <span>LKR 60k/day</span>
                  </div>
                </div>

                {/* Sort Order dropdown */}
                <div className="space-y-1.5 text-xs text-left">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
                    Sort Pricing Order
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-pointer focus:outline-none"
                  >
                    <option value="featured">Featured Selections</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Right Column: Fleet Grid lists */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Grid feedback header count */}
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-150 text-xs">
                <span className="font-semibold text-gray-700">
                  Showing <strong className="text-gray-900">{filteredVehicles.length}</strong> matching vehicles in Sri Lanka
                </span>
                {selectedCategory !== 'All' && (
                  <span className="bg-orange-50 text-orange-700 font-bold rounded px-2 py-0.5">
                    Segment: {selectedCategory}
                  </span>
                )}
              </div>

              {filteredVehicles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center space-y-4">
                  <p className="text-sm font-semibold text-gray-800">No vehicles match your search criteria</p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try loosening your budget filters, resetting transmission modes, or changing vehicle categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedTransmission('All');
                      setSelectedFuel('All');
                      setMaxPrice(60000);
                    }}
                    className="px-4 py-2 bg-gray-950 text-white font-bold text-xs rounded-xl uppercase tracking-wider"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((veh) => (
                    <VehicleCard
                      key={veh.id}
                      vehicle={veh}
                      onSelect={handleSelectVehicle}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>

        </main>
      )}

      {/* VIEW 3: VEHICLE DETAILS PAGE */}
      {currentView === 'details' && activeVehicle && (
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left font-sans">
          
          {/* Back button and quick category line */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('listings')}
              className="text-xs font-semibold text-gray-650 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              ← Back to listing directory
            </button>
            <span className="text-xs text-gray-400 font-mono font-bold uppercase">
              Spot ID: {activeVehicle.id}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left side details: Large Image block gallery & detailed specs */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Primary image visual container */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm relative">
                <img
                  src={activeVehicle.images[activeImageIndex] || activeVehicle.main_image}
                  alt={activeVehicle.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Category overlay */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-gray-950/90 text-white font-display text-xs font-extrabold uppercase tracking-widest rounded-full shadow-md">
                  {activeVehicle.category}
                </span>
              </div>

              {/* Thumbnail Gallery Row */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 select-none">
                {activeVehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-video rounded-xl overflow-hidden bg-gray-100 shrink-0 border-2 transition-all cursor-pointer ${activeImageIndex === idx ? 'border-orange-500 scale-95 shadow' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img} alt="Thumbnail review" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Title, prices, specifications */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <h1 className="font-display font-extrabold text-2xl sm:text-3.5xl text-gray-950 tracking-tight leading-tight">
                      {activeVehicle.name}
                    </h1>
                    <span className="text-xs text-gray-400 font-mono block mt-1 uppercase font-semibold">
                      Private owner coordinator setup • {activeVehicle.available ? '● Ready for reservation' : '✕ Dormant'}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] uppercase font-mono font-extrabold text-gray-400 tracking-wider">
                      Required Cost
                    </span>
                    <span className="font-display font-black text-2xl sm:text-3xl text-orange-600 tracking-tight block">
                      {formatPrice(activeVehicle.price_per_day)}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 font-mono block">
                      per day
                    </span>
                  </div>
                </div>

                {/* Specs Horizontal Badge box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-mono font-medium block uppercase">Transmission</span>
                    <span className="font-bold text-gray-955 text-xs block">{activeVehicle.transmission}</span>
                  </div>

                  <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-mono font-medium block uppercase">Fuel Type</span>
                    <span className="font-bold text-gray-955 text-xs block">{activeVehicle.fuel_type}</span>
                  </div>

                  <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-mono font-medium block uppercase">Seats Count</span>
                    <span className="font-bold text-gray-955 text-xs block">{activeVehicle.seats} Persons</span>
                  </div>

                  <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 font-mono font-medium block uppercase">Security Deposit Refund</span>
                    <span className="font-bold text-gray-955 text-xs block">{formatPrice(activeVehicle.deposit_amount)}</span>
                  </div>
                </div>

                {/* Additional Specifications lists */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="font-display font-bold text-gray-950 text-sm">
                    Inclusions & Constraints
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 font-sans text-xs text-gray-650">
                    <div className="flex justify-between border-b border-gray-100/60 pb-1.5">
                      <span className="text-gray-400">Mileage Limit:</span>
                      <span className="font-bold text-gray-900">{activeVehicle.mileage_limit}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100/60 pb-1.5">
                      <span className="text-gray-400">Minimum Lead Time:</span>
                      <span className="font-semibold text-orange-655 font-mono">5 Days in Advance</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100/60 pb-1.5">
                      <span className="text-gray-400">Security Pre-Auth Required:</span>
                      <span className="font-bold text-emerald-700 font-mono uppercase text-[10px]">NIC/Driving Licence Attachments</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100/60 pb-1.5">
                      <span className="text-gray-400">Owner Direct Thread:</span>
                      <span className="font-bold text-gray-900 font-mono">Simulated WhatsApp Group</span>
                    </div>
                  </div>
                </div>

                {/* Description statement */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="font-display font-bold text-gray-950 text-sm">
                    About this Vehicle Spot
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-sans">
                    {activeVehicle.description}
                  </p>
                </div>

              </div>

            </div>

            {/* Right side details: Manual booking form columns */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Complex Booking Form component container */}
              <BookingForm
                vehicle={activeVehicle}
                onSuccess={() => {
                  setCurrentView('customer-dashboard');
                }}
              />

              {/* Inquiry safety block info */}
              <div className="bg-emerald-50/50 p-4.5 rounded-2xl border border-emerald-100 text-xs text-left text-emerald-950 space-y-2 font-sans">
                <span className="block font-extrabold uppercase font-mono text-[9px] text-emerald-800">
                  ⚡ Coordinator Security Double Lock
                </span>
                <p className="leading-relaxed">
                  We match checkout parameters across local owners on WhatsApp within 2 hours. Your files are encrypted during authorization and shredded immediately following successful return.
                </p>
              </div>

            </div>

          </div>

        </main>
      )}

      {/* VIEW 4: CUSTOMER DASHBOARD */}
      {currentView === 'customer-dashboard' && (
        <main className="flex-grow">
          <CustomerDashboard />
        </main>
      )}

      {/* VIEW 5: ADMIN SIDEBAR PORTAL */}
      {currentView === 'admin-dashboard' && (
        <main className="flex-grow">
          <AdminPortal />
        </main>
      )}

      {/* Footer component */}
      <Footer />

      {/* Floating Auth Dialog component */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
        />
      )}

    </div>
  );
};

// Orchestrate wrapper
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
