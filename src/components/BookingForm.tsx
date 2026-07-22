import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, AlertCircle, Sparkles, CheckCircle2, User, Phone } from 'lucide-react';

interface BookingFormProps {
  vehicle: Vehicle;
  onSuccess: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ vehicle, onSuccess }) => {
  const { addBooking, currentUser } = useApp();
  
  const [pickupDate, setPickupDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState<string>('Bandaranaike Intl Airport (CMB)');
  
  // Guest contact state for booking without sign-in
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Local YYYY-MM-DD calculations for input field min bounds to enforce 1-day lead rule
  const minPickupDateString = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${r}`;
  })();

  // Auto set dates for testing convenience (e.g. today + 1 day for pickup, today + 5 days for return)
  useEffect(() => {
    const today = new Date();
    
    // Pickup date 1 day in future
    const pDate = new Date(today);
    pDate.setDate(today.getDate() + 1);
    
    const py = pDate.getFullYear();
    const pm = String(pDate.getMonth() + 1).padStart(2, '0');
    const pd = String(pDate.getDate()).padStart(2, '0');
    setPickupDate(`${py}-${pm}-${pd}`);

    // Return date 5 days in future
    const rDate = new Date(today);
    rDate.setDate(today.getDate() + 5);
    
    const ry = rDate.getFullYear();
    const rm = String(rDate.getMonth() + 1).padStart(2, '0');
    const rd = String(rDate.getDate()).padStart(2, '0');
    setReturnDate(`${ry}-${rm}-${rd}`);
  }, []);

  // Calculate rental period and cost
  const daysCount = (() => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const totalPrice = daysCount * vehicle.price_per_day;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsSubmitting(true);

    if (!currentUser && (!guestName || !guestPhone)) {
      setError('Please enter your full name and contact number to proceed with the booking.');
      setIsSubmitting(false);
      return;
    }

    if (!pickupDate || !returnDate || !pickupLocation) {
      setError('All fields are required to calculate reservation parameters.');
      setIsSubmitting(false);
      return;
    }

    // Verify returning is strictly after pick up
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (end <= start) {
      setError('Return date must be later than the pickup date.');
      setIsSubmitting(false);
      return;
    }

    // Verify 1 Day Lead Time policy
    const today = new Date();
    today.setHours(0,0,0,0);
    const minLeadMs = 1 * 24 * 60 * 60 * 1000;
    if (start.getTime() - today.getTime() < minLeadMs) {
      setError('Booking requests must be placed at least 1 day in advance.');
      setIsSubmitting(false);
      return;
    }

    // Trigger state persistence
    const result = await addBooking({
      vehicle_id: vehicle.id,
      vehicle_name: vehicle.name,
      pickup_date: pickupDate,
      return_date: returnDate,
      pickup_location: pickupLocation,
      guest_name: currentUser ? undefined : guestName,
      guest_phone: currentUser ? undefined : guestPhone
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 5000);
    } else {
      setError(result.error || 'Failed to submit booking');
    }
    setIsSubmitting(false);
  };

  // Safe pricing number format
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="bg-orange-600 px-6 py-4.5 text-white flex items-center gap-2.5">
        <Sparkles className="w-5 h-5" />
        <div>
          <span className="font-display font-bold text-lg block">Inquire Booking</span>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-90">Verified Direct Owner Match</span>
        </div>
      </div>

      {success ? (
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-display font-extrabold text-xl text-gray-950">Inquiry Received!</h4>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            Your booking request for <strong className="text-gray-900">{vehicle.name}</strong> has been logged in <strong className="text-emerald-700">Pending</strong> status.
          </p>
          <div className="bg-orange-50/80 p-4 rounded-xl border border-orange-100 max-w-sm mx-auto space-y-1 text-left">
            <span className="block font-mono font-bold text-[10px] uppercase text-orange-900">Next Coordination Step</span>
            <span className="block text-xs leading-relaxed text-gray-700">
              Our team will coordinate with the vehicle owners group. We will contact you via WhatsApp to confirm details.
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono italic animate-pulse pt-2">
            Redirecting to dashboard to track status...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Guest details if not logged in */}
          {!currentUser && (
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-3">
              <span className="block text-xs font-bold text-orange-950 uppercase tracking-wider font-mono">
                Guest Contact Details
              </span>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="E.g., Kamal Perera"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                  />
                  <User className="w-4 h-4 text-orange-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1 font-mono">
                  Contact Number (WhatsApp)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+94 7X XXX XXXX"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                  />
                  <Phone className="w-4 h-4 text-orange-500 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          )}

          {/* Calendar Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">
                Pickup Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={pickupDate}
                  min={minPickupDateString}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer text-gray-900"
                />
                <Calendar className="w-4 h-4 text-orange-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">
                Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate || minPickupDateString}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer text-gray-950"
                />
                <Calendar className="w-4 h-4 text-orange-500 absolute left-3 top-3 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Lead Period Rule Indicator */}
          <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl flex gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-blue-900 leading-snug">
              Booking requests must be placed <strong className="text-blue-950 underline decoration-blue-400 font-bold">at least 1 day in advance</strong>.
            </p>
          </div>

          {/* Pickup Locations */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
              Pickup Location
            </label>
            <div className="relative">
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer text-gray-900"
              >
                <option value="Bandaranaike Intl Airport (CMB)">Bandaranaike Intl Airport (CMB)</option>
                <option value="Colombo 03 (Colpetty)">Colombo 03 (Colpetty)</option>
                <option value="Negombo Beach Boulevard">Negombo Beach Boulevard</option>
                <option value="Galle Fort Clock Tower">Galle Fort Clock Tower</option>
                <option value="Kandy Town Center (KCC)">Kandy Town Center (KCC)</option>
              </select>
              <MapPin className="w-4 h-4 text-orange-500 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Pricing Breakdown Panel */}
          {daysCount > 0 && (
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 font-sans text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">{formatPrice(vehicle.price_per_day)} × {daysCount} Days</span>
                <span className="font-semibold text-gray-950">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200/60 pt-2 text-sm text-orange-950">
                <span>Inquiry Cost Estimate</span>
                <span className="font-display font-extrabold text-lg text-orange-600">{formatPrice(totalPrice)}</span>
              </div>
              <div className="text-[9px] text-gray-400 leading-normal text-center pt-2">
                * No pre-payment required. Payment processed directly on verified setup coordination.
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-[11px] font-semibold text-red-700 leading-relaxed">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-md hover:shadow-orange-500/10 cursor-pointer transition-all"
            >
              {isSubmitting ? 'Requesting match...' : 'Request Coordination Match'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
};
