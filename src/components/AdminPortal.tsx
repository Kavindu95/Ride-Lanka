import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, Vehicle, User, BookingStatus } from '../types';
import { 
  Users, Car, Clock, ShieldAlert, CheckCircle2, XCircle, 
  Plus, Edit2, Trash2, Eye, MessageSquareCode, TrendingUp, DollarSign, ListFilter, MapPin, Calendar, Smartphone, X, Check, Save 
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    vehicles, bookings, currentUser, 
    addVehicle, updateVehicle, deleteVehicle, updateBookingStatus 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'fleet' | 'bookings' | 'users'>('analytics');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [documentViewerBooking, setDocumentViewerBooking] = useState<Booking | null>(null);

  // New vehicle form state
  const [newVehName, setNewVehName] = useState<string>('');
  const [newVehCategory, setNewVehCategory] = useState<'Economy' | 'Sedan' | 'Minivan' | 'Van' | 'SUV' | 'Luxury Vehicles'>('SUV');
  const [newVehTransmission, setNewVehTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [newVehFuel, setNewVehFuel] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>('Hybrid');
  const [newVehSeats, setNewVehSeats] = useState<number>(5);
  const [newVehPrice, setNewVehPrice] = useState<number>(18000);
  const [newVehDeposit, setNewVehDeposit] = useState<number>(50000);
  const [newVehMileage, setNewVehMileage] = useState<string>('150 km/day (LKR 80 per extra km)');
  const [newVehDesc, setNewVehDesc] = useState<string>('');
  const [newVehImage, setNewVehImage] = useState<string>('https://images.unsplash.com/photo-1549399542-7cd3cf17a35b?auto=format&fit=crop&w=1000&q=80');
  const [newVehOwner, setNewVehOwner] = useState<string>('+94 77 555 4433 (Sahan)');

  // Form handling
  const handleAddNewCar = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: newVehName,
      category: newVehCategory,
      transmission: newVehTransmission,
      fuel_type: newVehFuel,
      seats: Number(newVehSeats),
      price_per_day: Number(newVehPrice),
      deposit_amount: Number(newVehDeposit),
      mileage_limit: newVehMileage,
      description: newVehDesc,
      main_image: newVehImage,
      images: [newVehImage],
      available: true,
      owner_contact: newVehOwner
    };

    if (editingVehicle) {
      updateVehicle({ ...data, id: editingVehicle.id });
    } else {
      addVehicle(data);
    }

    // Reset States
    setNewVehName('');
    setNewVehDesc('');
    setShowAddModal(false);
    setEditingVehicle(null);
  };

  const handleEditInit = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setNewVehName(veh.name);
    setNewVehCategory(veh.category);
    setNewVehTransmission(veh.transmission);
    setNewVehFuel(veh.fuel_type);
    setNewVehSeats(veh.seats);
    setNewVehPrice(veh.price_per_day);
    setNewVehDeposit(veh.deposit_amount);
    setNewVehMileage(veh.mileage_limit);
    setNewVehDesc(veh.description);
    setNewVehImage(veh.main_image);
    setNewVehOwner(veh.owner_contact);
    setShowAddModal(true);
  };

  const handleToggleAvailability = (veh: Vehicle) => {
    updateVehicle({
      ...veh,
      available: !veh.available
    });
  };

  // Safe pricing number format
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Compile calculations for high-quality dashboard analytics counters
  const statsBookingsCount = bookings.length;
  const pendingRequestsCount = bookings.filter(b => b.status === 'pending').length;
  const approvedRequestsCount = bookings.filter(b => b.status === 'approved').length;
  const totalCommissionExpected = bookings.reduce((sum, b) => b.status === 'approved' ? sum + b.commission : sum, 0);
  const totalRegisteredVehicles = vehicles.length;
  
  // WhatsApp notification dispatch drafts
  const getWhatsAppOwnerTemplate = (b: Booking) => {
    const start = b.pickup_date;
    const end = b.return_date;
    const vehName = b.vehicle_name;
    const msg = `Hi, RideLanka Admin here. We have an inquiry for your ${vehName} from ${start} to ${end}. Customer has uploaded driving identity docs for pre-verification. 10% commission applied on LKR ${b.total_price}. Please confirm availability ASAP!`;
    return `https://wa.me/94723350075?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppCustomerTemplate = (b: Booking, approved: boolean) => {
    const statusText = approved ? 'APPROVED. We have locked key reservation.' : 'REJECTED due to vehicle maintenance schedule conflicts.';
    const msg = `Ayubowan ${b.user_name}, your manual inquiry #${b.id} for the ${b.vehicle_name} from ${b.pickup_date} to ${b.return_date} is ${statusText}. Our team is starting a group thread to connect you. See dashboard!`;
    return `https://wa.me/${b.user_phone.replace(/[^0-9]/g, '') || '94723350075'}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md uppercase font-mono tracking-wider inline-block">
            Management Control Centre
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight mt-1">
            RideLanka Backoffice Portal
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure listed vehicles, review user document verification attachments, and draft WhatsApp dispatch alerts.
          </p>
        </div>

        {/* Quick launch modal trigger */}
        <button
          onClick={() => {
            setEditingVehicle(null);
            setShowAddModal(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-orange-500/15 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle Spot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'analytics' 
                  ? 'bg-gray-950 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5" />
                Analytics & Dashboard
              </span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'fleet' 
                  ? 'bg-gray-950 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Car className="w-4.5 h-4.5" />
                Manage Fleet Cars
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded-full font-mono">
                {totalRegisteredVehicles}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                activeTab === 'bookings' 
                  ? 'bg-gray-950 text-white shadow-xs' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5" />
                All Booking Requests
              </span>
              {pendingRequestsCount > 0 && (
                <span className="text-[10px] bg-orange-500 text-white font-bold px-2.5 py-0.5 rounded-full font-mono animate-pulse">
                  {pendingRequestsCount} new
                </span>
              )}
            </button>
          </div>

          {/* Quick Business Rules Informer Widget */}
          <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 text-xs text-red-950 space-y-2">
            <span className="block font-bold text-red-900 font-mono text-[10px] uppercase">
              Coordinator Note
            </span>
            <p className="leading-relaxed">
              No payments go through this dashboard. You are responsible for finalizing the booking details on WhatsApp before changing the status to <strong className="text-red-950">Approved</strong>.
            </p>
          </div>
        </div>

        {/* Core Main View Panel */}
        <div className="lg:col-span-3">

          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Cards Grid Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <span className="text-xs text-gray-400 font-medium font-mono uppercase tracking-wider block">
                    Target Commissions
                  </span>
                  <span className="font-display font-black text-2xl text-gray-950 block mt-1">
                    {formatPrice(totalCommissionExpected)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                    ✓ From approved bookings
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <span className="text-xs text-gray-400 font-medium font-mono uppercase tracking-wider block">
                    Pending Inquiries
                  </span>
                  <span className="font-display font-black text-2xl text-orange-600 block mt-1">
                    {pendingRequestsCount}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 block font-mono">
                    Needs prompt action
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <span className="text-xs text-gray-400 font-medium font-mono uppercase tracking-wider block">
                    Confirmed Runs
                  </span>
                  <span className="font-display font-black text-2xl text-emerald-600 block mt-1">
                    {approvedRequestsCount}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 block font-mono">
                    Owner matched
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <span className="text-xs text-gray-400 font-medium font-mono uppercase tracking-wider block">
                    Total Inquired
                  </span>
                  <span className="font-display font-black text-2xl text-gray-900 block mt-1">
                    {statsBookingsCount}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 block font-mono">
                    Volume received
                  </span>
                </div>

              </div>

              {/* Pending Action Bookings Highlight */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-display font-bold text-gray-950 text-base">
                    Action Required Inquiries ({pendingRequestsCount})
                  </h3>
                </div>

                {pendingRequestsCount === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    ✓ Clean inbox. No pending inquiries need coordination checkouts right now.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.filter(b => b.status === 'pending').map((b) => (
                      <div key={b.id} className="p-4 bg-orange-50/30 rounded-xl border border-orange-100/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] text-orange-700 font-bold uppercase font-mono">Inquiry #{b.id}</span>
                          <h4 className="font-display font-extrabold text-sm text-gray-950">{b.user_name} • {b.vehicle_name}</h4>
                          <span className="text-gray-500 block font-mono">📅 {b.pickup_date} to {b.return_date} ({b.pickup_location})</span>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setDocumentViewerBooking(b)}
                            className="bg-white text-gray-700 hover:text-gray-950 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Docs
                          </button>
                          
                          <a
                            href={getWhatsAppOwnerTemplate(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <MessageSquareCode className="w-3.5 h-3.5" />
                            Coordinate Owner
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE FLEET */}
          {activeTab === 'fleet' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <span className="font-display font-bold text-gray-900 text-sm">Listed Vehicles Catalog</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 font-mono font-bold uppercase border-b border-gray-200">
                      <th className="p-4">Vehicle Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Specs</th>
                      <th className="p-4">Pricing</th>
                      <th className="p-4 text-center">Availability</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={v.main_image}
                              alt={v.name}
                              className="w-10 h-10 object-cover rounded-lg shrink-0"
                            />
                            <div>
                              <span className="font-bold block text-gray-950 text-sm leading-tight">{v.name}</span>
                              <span className="text-[10px] text-gray-400 block font-mono">Owner: {v.owner_contact}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-gray-700">
                          {v.category}
                        </td>

                        <td className="p-4 font-mono text-gray-500">
                          <span>{v.transmission} • {v.fuel_type} • {v.seats} Seats</span>
                        </td>

                        <td className="p-4 font-bold text-gray-950">
                          {formatPrice(v.price_per_day)}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleAvailability(v)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-all ${
                              v.available 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}
                          >
                            {v.available ? '● Active listed' : '✕ Dormant'}
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEditInit(v)}
                              className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              title="Edit Car Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteVehicle(v.id)}
                              className="p-1.5 rounded text-red-600 hover:text-red-900 hover:bg-red-50"
                              title="Remove Car"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ALL BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="font-display font-bold text-gray-900 text-sm">Review Booking Pipelines</span>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No rentals lodged yet.
                </div>
              ) : (
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-500 font-mono font-medium uppercase border-b border-gray-200">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Requested Car</th>
                        <th className="p-4">Dates & Route</th>
                        <th className="p-4">Calculated Costs</th>
                        <th className="p-4">Identification</th>
                        <th className="p-4">Action Pipeline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => {
                        const isPending = b.status === 'pending';
                        const isApproved = b.status === 'approved';
                        const isRejected = b.status === 'rejected';

                        return (
                          <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-all">
                            
                            <td className="p-4">
                              <div>
                                <span className="font-bold text-gray-950 block">{b.user_name}</span>
                                <span className="text-[10px] text-gray-400 font-mono block">{b.user_phone}</span>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="font-semibold text-gray-900">{b.vehicle_name}</span>
                            </td>

                            <td className="p-4 font-mono text-gray-600 space-y-0.5">
                              <span className="block font-bold">📅 {b.pickup_date} to {b.return_date}</span>
                              <span className="block text-[10px] text-gray-400">📍 {b.pickup_location}</span>
                            </td>

                            <td className="p-4">
                              <div>
                                <span className="font-black text-gray-950 block">{formatPrice(b.total_price)}</span>
                                <span className="text-[10px] text-orange-600 font-semibold font-mono block bg-orange-50 px-1 rounded inline-block">
                                  Fee: {formatPrice(b.commission)}
                                </span>
                              </div>
                            </td>

                            <td className="p-4">
                              <button
                                onClick={() => setDocumentViewerBooking(b)}
                                className="bg-white hover:bg-gray-100 border border-gray-200 px-2 py-1 rounded inline-flex items-center gap-1 text-[10px] font-bold text-gray-700 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Review Files
                              </button>
                            </td>

                            <td className="p-4">
                              {isPending ? (
                                <div className="space-y-1.5 min-w-44">
                                  {/* Manual actions button */}
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'approved')}
                                      className="p-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold text-[10px] uppercase shadow-xs cursor-pointer flex-1 text-center"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'rejected')}
                                      className="p-1 px-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded font-bold text-[10px] uppercase shadow-xs cursor-pointer flex-1 text-center"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                  
                                  {/* Draft group notifications template */}
                                  <a
                                    href={getWhatsAppOwnerTemplate(b)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-[9px] text-gray-500 text-center hover:text-emerald-700 font-mono font-medium underline"
                                  >
                                    💬 Draft Owners Group Ping
                                  </a>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-1 align-start">
                                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase inline-block text-center ${
                                    isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                  }`}>
                                    {b.status}
                                  </span>
                                  
                                  {/* Quick Customer update WhatsApp notification line */}
                                  <a
                                    href={getWhatsAppCustomerTemplate(b, isApproved)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] text-gray-400 hover:text-slate-900 font-mono underline"
                                  >
                                    Update Customer on WhatsApp
                                  </a>
                                </div>
                              )}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: ADD / EDIT FLEET CAR VEHICLE POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="font-display font-extrabold text-lg text-gray-900">
                {editingVehicle ? `Edit ${editingVehicle.name}` : 'Post Premium Rent A Car'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewCar} className="p-6 space-y-4 overflow-y-auto max-h-[60vh] text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Car Manufacturer & Model Name
                  </label>
                  <input
                    type="text"
                    value={newVehName}
                    onChange={(e) => setNewVehName(e.target.value)}
                    placeholder="E.g., Toyota Land Cruiser..."
                    required
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Category Type Segment
                  </label>
                  <select
                    value={newVehCategory}
                    onChange={(e) => setNewVehCategory(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Van">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury Vehicles">Luxury Vehicles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Transmission Mode
                  </label>
                  <select
                    value={newVehTransmission}
                    onChange={(e) => setNewVehTransmission(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Automatic">Automatic Transmission</option>
                    <option value="Manual">Manual Stick Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Fuel Drive Type
                  </label>
                  <select
                    value={newVehFuel}
                    onChange={(e) => setNewVehFuel(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Hybrid">Hybrid Synergy Drive</option>
                    <option value="Diesel">Premium Turbo Diesel</option>
                    <option value="Petrol">Octane Petrol</option>
                    <option value="Electric">Pure EV Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Maximum Seats Capacity
                  </label>
                  <input
                    type="number"
                    value={newVehSeats}
                    onChange={(e) => setNewVehSeats(Number(e.target.value))}
                    required
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Daily Rental Price (LKR)
                  </label>
                  <input
                    type="number"
                    value={newVehPrice}
                    onChange={(e) => setNewVehPrice(Number(e.target.value))}
                    required
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Security Refundable Deposit (LKR)
                  </label>
                  <input
                    type="number"
                    value={newVehDeposit}
                    onChange={(e) => setNewVehDeposit(Number(e.target.value))}
                    required
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                    Mileage Limit Details
                  </label>
                  <input
                    type="text"
                    value={newVehMileage}
                    onChange={(e) => setNewVehMileage(e.target.value)}
                    required
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                  Car Main Cover Image Link
                </label>
                <input
                  type="text"
                  value={newVehImage}
                  onChange={(e) => setNewVehImage(e.target.value)}
                  placeholder="Unsplash direct URL..."
                  required
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                  Owner Contact Name & Mobile Number (Admin private coordinate)
                </label>
                <input
                  type="text"
                  value={newVehOwner}
                  onChange={(e) => setNewVehOwner(e.target.value)}
                  placeholder="+94 77 XXX XXXX (Name)"
                  required
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
                  Marketplace Public Description
                </label>
                <textarea
                  value={newVehDesc}
                  onChange={(e) => setNewVehDesc(e.target.value)}
                  placeholder="Details regarding conditions of the rent-a-car, inclusions..."
                  required
                  rows={3}
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-950 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 text-white hover:bg-orange-700 font-bold rounded-xl text-xs uppercase"
                >
                  {editingVehicle ? 'Save Modifications' : 'Publish Car Spot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: IDENTIFICATION FILES ATTACHMENT REVIEW DIALOG */}
      {documentViewerBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden p-6 text-left relative">
            <button
              onClick={() => setDocumentViewerBooking(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-950"
            >
              <X className="w-5 h-5" />
            </button>
            
            <span className="text-[10px] text-red-650 bg-red-50 border border-red-150 rounded px-2 py-0.5 font-mono font-bold">
              🔒 Encrypted Security Desk
            </span>

            <h3 className="font-display font-black text-xl text-gray-900 mt-2 mb-1">
              Identity Verification Document
            </h3>
            <p className="text-xs text-gray-500 font-mono mb-5">
              Applicant Name: {documentViewerBooking.user_name} ({documentViewerBooking.user_phone})
            </p>

            <div className="space-y-4">
              
              {/* Document Block 1: National identity details */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs text-gray-950 font-display">
                    Identification Copy:
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    {documentViewerBooking.doc_nic_passport_name}
                  </span>
                </div>
                {/* Visual Simulation frame of Sri Lankan National Identity Card or Passport */}
                <div className="aspect-video w-full rounded-lg bg-indigo-950 text-indigo-200 p-4 font-mono select-none text-[10px] flex flex-col justify-between shadow-inner relative border border-indigo-900/40">
                  <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-indigo-950/40 rounded-lg pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold tracking-widest text-[#cca355]">DEMOCRATIC SOCIALIST REPUBLIC SRI LANKA</span>
                    <span className="text-[9px] border px-1 border-indigo-500/60 text-indigo-400">PASSPORT/NIC DEPT</span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-18 bg-indigo-900/70 rounded border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-sans text-xs">
                      👤 PHOTO
                    </div>
                    <div className="space-y-1">
                      <p><span className="text-[9px] text-indigo-400 font-semibold uppercase">IDENTITY NO:</span> 199652410V</p>
                      <p><span className="text-[9px] text-indigo-400 font-semibold uppercase">FULL NAME:</span> {documentViewerBooking.user_name.toUpperCase()}</p>
                      <p><span className="text-[9px] text-indigo-400 font-semibold uppercase">NATIONALITY:</span> SRI LANKAN</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-[8px] text-indigo-400">
                    <span>DOCUMENT SECURE COMPLIANT</span>
                    <span>VERIFIED AT RIDE LANKA DISPATCH OFFICE</span>
                  </div>
                </div>
              </div>

              {/* Document Block 2: National driving license details */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs text-gray-950 font-display">
                    Sri Lankan Driving Licence Copy:
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    {documentViewerBooking.doc_driving_license_name}
                  </span>
                </div>
                {/* Visual mock card representation */}
                <div className="aspect-video w-full rounded-lg bg-emerald-950 text-emerald-250 p-4 font-mono select-none text-[10px] flex flex-col justify-between shadow-inner border border-emerald-900/40 relative">
                  <div className="absolute inset-0 bg-linear-to-b from-emerald-500/10 to-emerald-950/40 rounded-lg pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold tracking-wider text-[#d0e190]">SRI LANKAN DRIVING LICENCE</span>
                    <span className="text-[9px] border px-1 border-emerald-500/60 text-emerald-400">CLASS B M/V</span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-18 bg-emerald-900/70 rounded border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-sans text-xs">
                      👤 PHOTO
                    </div>
                    <div className="space-y-1">
                      <p><span className="text-[9px] text-emerald-400 font-semibold uppercase">LIC NO:</span> DL-0042456LK</p>
                      <p><span className="text-[9px] text-emerald-400 font-semibold uppercase">HOLDER:</span> {documentViewerBooking.user_name.toUpperCase()}</p>
                      <p><span className="text-[9px] text-emerald-400 font-semibold uppercase">EXPIRY:</span> 2032-12-05</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-[8px] text-emerald-400">
                    <span>PRE-AUTHORIZED COMPLIANCE</span>
                    <span>COMMISSION VALIDATED SECURE</span>
                  </div>
                </div>
              </div>

            </div>

            <button
              onClick={() => setDocumentViewerBooking(null)}
              className="mt-6 w-full py-2.5 bg-gray-900 hover:bg-gray-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Done reviewing files
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
