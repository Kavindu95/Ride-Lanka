import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { LayoutDashboard, Clock, CheckCircle2, XCircle, User, Phone, MapPin, Calendar, HelpCircle, Receipt, ExternalLink, ShieldCheck } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, bookings, updateBookingStatus, register } = useApp();
  
  // Local profile states
  const [name, setName] = useState<string>(currentUser?.full_name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-100 text-center space-y-4">
        <LayoutDashboard className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="font-display font-bold text-xl text-gray-900">Sign in to Access Dashboard</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Please log in or sign up using the developer testing panel in the top navigation bar to view your personal booking inquiries.
        </p>
      </div>
    );
  }

  // Filter current user's bookings
  const myBookings = bookings.filter(b => b.user_id === currentUser.id);

  const stats = {
    total: myBookings.length,
    pending: myBookings.filter(b => b.status === 'pending').length,
    approved: myBookings.filter(b => b.status === 'approved').length,
    estimatedSum: myBookings.reduce((sum, b) => b.status === 'approved' ? sum + b.total_price : sum, 0)
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    // Since we want to update the currentUser globally
    register(email, name, phone, currentUser.role);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Banner Summary Header */}
      <div className="bg-gray-950 text-white p-6 sm:p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -z-10" />
        <div>
          <span className="text-orange-500 font-mono text-xs uppercase font-extrabold tracking-wider">
            Guest customer portal
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Ayubowan, {currentUser.full_name}!
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            Inquire, track manual dispatch status, and launch WhatsApp communication instantly with car group admins.
          </p>
        </div>

        {/* Mini stats cards bundle */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center sm:min-w-28 text-orange-400">
            <span className="block text-xs text-gray-400 font-medium">Inquiries</span>
            <span className="font-display font-extrabold text-xl">{stats.total}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center sm:min-w-28 text-amber-400">
            <span className="block text-xs text-gray-400 font-medium font-mono">Pending</span>
            <span className="font-display font-extrabold text-xl">{stats.pending}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center sm:min-w-28 text-emerald-400">
            <span className="block text-xs text-gray-400 font-medium">Approved</span>
            <span className="font-display font-extrabold text-xl">{stats.approved}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of inquiries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-xl text-gray-950 tracking-tight flex items-center gap-2">
              <span>My Booking Inquiries</span>
              <span className="text-xs bg-gray-100 text-gray-700 font-mono font-bold px-2.5 py-0.5 rounded-full">
                {myBookings.length} total
              </span>
            </h3>
          </div>

          {myBookings.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center space-y-3">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">No active rental inquiries found</p>
              <p className="text-xs text-gray-500 leading-normal max-w-xs mx-auto">
                Explore our premium line of sedans, vans, luxury sedans, and SUVs in Colombo and submit a 5-day advance checkout request.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => {
                const isPending = b.status === 'pending';
                const isApproved = b.status === 'approved';
                const isRejected = b.status === 'rejected';

                return (
                  <div key={b.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:border-gray-200 transition-all space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold tracking-wider">
                          Inquiry #{b.id} • Submitted {new Date(b.created_at).toLocaleDateString()}
                        </span>
                        <h4 className="font-display font-bold text-gray-950 text-base">
                          {b.vehicle_name}
                        </h4>
                      </div>
                      
                      {/* Status Badging */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${
                        isPending ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        isApproved ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {isPending && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 animate-bounce" />}
                        {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                        {b.status}
                      </span>
                    </div>

                    {/* Timeline workflow details explaining the Manual WhatsApp Coordination system */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-gray-950">Pickup Location</span>
                          <span className="text-gray-500">{b.pickup_location}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-gray-950">Rental Period</span>
                          <span className="text-gray-500">{b.pickup_date} to {b.return_date}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Receipt className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-gray-950">Expected Total</span>
                          <span className="text-gray-500 font-semibold">{formatPrice(b.total_price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Process Status bar */}
                    <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                        <span className="text-[10px] uppercase text-gray-500 font-bold">Files Security:</span>
                        <span className="text-gray-700 font-semibold text-[10px]">
                          📎 {b.doc_nic_passport_name} • 📎 {b.doc_driving_license_name}
                        </span>
                      </div>

                      {isApproved && (
                        <a
                          href={`https://wa.me/94723350075?text=Hi%20RideLanka,%20I'm%20inquiring%20about%20my%20approved%20booking%20%23${b.id}%20for%20the%20${encodeURIComponent(b.vehicle_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Chat WhatsApp Coordinator
                        </a>
                      )}

                      {isPending && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          <span>Owner availability check active...</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Profile details & Business Logic helper panels */}
        <div className="space-y-6">
          
          {/* Profile settings Form */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-display font-extrabold text-base text-gray-950 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              <span>Customer Settings</span>
            </h3>

            {isSaved && (
              <div className="p-2 text-center text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg">
                ✓ Settings updated instantly!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">
                  Registered Email (Immutable)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gray-950 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
              >
                Update Profile Info
              </button>
            </form>
          </div>

          {/* Quick Business workflow overview */}
          <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 space-y-3 font-sans">
            <h4 className="font-display font-extrabold text-sm text-orange-950">
              Booking Coordination Guide
            </h4>
            <ol className="space-y-2 text-xs text-gray-700 leading-normal">
              <li className="flex gap-2">
                <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>You place a 10% commission inquiry on our portal without any pre-payments.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>RideLanka matches dates with active vehicle owners in real-time WhatsApp groups.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Once approved, you connect directly with the driver to finalize key deposits on physical pickup.</span>
              </li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
};
