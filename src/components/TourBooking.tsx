import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass, Calendar, Users, MapPin, Check,
  ChevronRight, ArrowRight, Landmark, TreePine, HeartHandshake, Info
} from 'lucide-react';

interface TourPackage {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  price_base: number;
  image: string;
  highlights: string[];
  stops: string[];
  description: string;
}

const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'tour-hill',
    name: 'Tea Trails & Misty Mountains',
    tagline: 'Scenic Railways, Tea Estates & Waterfalls',
    duration: '4 Days / 3 Nights',
    price_base: 85000,
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=80', // Ella Train / Bridge
    highlights: [
      'Walk through lush tea estates & Nuwara Eliya "Little England"',
      'Take the iconic scenic train ride over Nine Arch Bridge',
      'Hike Little Adam\'s Peak for breathtaking panoramic views',
      'Scenic stopovers at Devon & St. Clair\'s Waterfalls'
    ],
    stops: ['Kandy', 'Nuwara Eliya', 'Ella', 'Kitulgala'],
    description: 'Escape to the fresh, misty mountain air of Sri Lanka\'s legendary hill country. Discover colonial tea estates, enjoy the iconic train voyage through emerald valleys, explore the bohemian mountain town of Ella, and marvel at cascading waterfalls carving through deep mountain passes.'
  },
  {
    id: 'tour-cultural',
    name: 'Cultural Heritage Odyssey',
    tagline: 'Journey through Sri Lanka\'s Ancient Kingdoms',
    duration: '5 Days / 4 Nights',
    price_base: 105000,
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1000&q=80', // Sigiriya
    highlights: [
      'Climb the iconic Sigiriya Rock Fortress',
      'Explore ancient ruins of Polonnaruwa Kingdom',
      'Visit Dambulla Golden Cave Temple',
      'Witness cultural dance & Temple of the Tooth in Kandy'
    ],
    stops: ['Colombo', 'Dambulla', 'Sigiriya', 'Polonnaruwa', 'Kandy'],
    description: 'Immerse yourself in the rich history and spiritual legacy of Sri Lanka. This tour takes you through the famed Cultural Triangle, exploring UNESCO World Heritage ruins, climbing spectacular sky-fortresses, and visiting sacred temples with a dedicated private tourist driver.'
  },
  {
    id: 'tour-wildlife',
    name: 'Southern Coast & Wildlife Safari',
    tagline: 'Sun-Kissed Beaches & Thrilling Leopards',
    duration: '6 Days / 5 Nights',
    price_base: 135000,
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80', // Leopard / Yala
    highlights: [
      'Walking tour of historic Galle Dutch Fort',
      'Whale watching cruise in deep-blue Mirissa waters',
      'Exclusive half-day 4x4 Jeep Safari in Yala National Park',
      'Relaxation on beautiful Hikkaduwa & Bentota beaches'
    ],
    stops: ['Colombo', 'Bentota', 'Hikkaduwa', 'Galle Fort', 'Mirissa', 'Yala'],
    description: 'Experience the perfect blend of colonial coastal charm, tropical beach relaxation, and raw wildlife. Search for the elusive Sri Lankan leopards in Yala, sail out to witness majestic blue whales in Mirissa, and walk the historic cobblestone streets of the 16th-century Galle Dutch Fort.'
  },
  {
    id: 'tour-grand',
    name: 'Ultimate Sri Lanka Expedition',
    tagline: 'The Definitive All-Inclusive Island Experience',
    duration: '9 Days / 8 Nights',
    price_base: 235000,
    image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1000&q=80', // Scenic beach coast
    highlights: [
      'Comprehensive Sigiriya, Kandy & Cultural Triangle tours',
      'Scenic highlands railway journey & Nuwara Eliya tea trails',
      'Leopard-spotting safari in Yala National Park',
      'Unwinding in Galle Fort & beautiful Southern beach shorelines'
    ],
    stops: ['Colombo', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle Fort', 'Bentota'],
    description: 'The ultimate grand voyage for families or groups wanting to experience the complete spectrum of Sri Lanka. From historical monuments and misty mountains to raw wildlife and pristine sandy shores, this premium fully guided tour ensures you do not miss a single highlight of our paradise island.'
  }
];

export const TourBooking: React.FC = () => {
  const { currentUser, addBooking } = useApp();

  // States
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [travellersCount, setTravellersCount] = useState<number>(2);
  const [vehicleTier, setVehicleTier] = useState<'economy' | 'standard' | 'premium'>('economy');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Guest state if not logged in
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  // Default dates helper
  React.useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // At least 1 day in advance
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setStartDate(`${y}-${m}-${d}`);
  }, []);

  const getVehicleTierCharge = (tier: 'economy' | 'standard' | 'premium') => {
    switch (tier) {
      case 'standard': return 25000;
      case 'premium': return 65000;
      case 'economy':
      default: return 0;
    }
  };

  const getPassengerCharge = (count: number) => {
    if (count >= 1 && count <= 2) return 0;
    if (count >= 3 && count <= 4) return 10000;
    if (count >= 5 && count <= 7) return 45000;
    if (count >= 8 && count <= 10) return 70000;
    return 0;
  };

  const calculateTotalPrice = (tour: TourPackage) => {
    let base = tour.price_base;
    base += getVehicleTierCharge(vehicleTier);
    base += getPassengerCharge(travellersCount);
    return Math.round(base);
  };

  const handleSelectTour = (tour: TourPackage) => {
    setSelectedTour(tour);
    setSpecialRequests('');
    setSuccess(false);
    setError('');

    // Scroll smoothly to form
    setTimeout(() => {
      document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) return;
    if (!currentUser && (!guestName || !guestPhone)) {
      setError('Please enter your full name and WhatsApp contact number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Calculate return date based on duration
      const durationDaysStr = selectedTour.duration.split(' ')[0];
      const durationDays = parseInt(durationDaysStr) || 5;

      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + durationDays - 1);

      const returnDateStr = end.toISOString().split('T')[0];
      const finalPrice = calculateTotalPrice(selectedTour);

      // Submit booking with specialized vehicle_id starting with 'tour-'
      const res = await addBooking({
        vehicle_id: `tour-${selectedTour.id}`,
        vehicle_name: `Tour: ${selectedTour.name} (${vehicleTier.toUpperCase()} Vehicle - ${travellersCount} Guests)`,
        pickup_date: startDate,
        return_date: returnDateStr,
        pickup_location: `Colombo / Bandaranaike Airport (CMB)`,
        total_price: finalPrice,
        guest_name: currentUser ? undefined : guestName,
        guest_phone: currentUser ? undefined : guestPhone
      } as any);

      if (res.success) {
        setSuccess(true);
        // Reset selections
        setTimeout(() => {
          setSelectedTour(null);
          setSuccess(false);
        }, 5000);
      } else {
        setError(res.error || 'Failed to submit tour request.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex-1 bg-slate-50 font-sans">

      {/* Visual Hero Header Section */}
      <section className="relative bg-gray-950 text-white py-16 sm:py-24 overflow-hidden text-left">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1588598126483-2410482935f7?auto=format&fit=crop&w=1800&q=80"
            alt="Scenic Sri Lanka Train"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-orange-400">
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            <span>Sri Lankan Tailored Tour Packages</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight max-w-2xl">
            Curated Island Tours with <br />
            <span className="text-orange-500">Private Drivers & Vehicles</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Explore Sri Lanka at your own pace. Choose from our expertly designed private tour itineraries, select your preferred vehicle tier, and enjoy a dedicated, vetted chauffeur-guide throughout your journey.
          </p>
        </div>
      </section>

      {/* Main Tour Packages Catalog */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-left">
          <span className="text-xs font-extrabold text-orange-600 font-mono tracking-wider uppercase block">
            Hand-Crafted Itineraries
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight mt-1">
            Choose Your Signature Sri Lankan Experience
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            Each package is fully inclusive of a private high-spec vehicle, professional chauffeur-driver, fuel, toll costs, and parking. Hotel booking is excluded.
          </p>
        </div>

        {/* Tour Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {TOUR_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Package Image Column */}
              <div className="relative h-56 w-full">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-orange-600 text-white font-mono text-[10px] font-bold uppercase rounded-md shadow">
                  {pkg.duration}
                </span>
              </div>

              {/* Package Details Column */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-5">
                <div className="space-y-1.5">
                  <h3 className="font-display font-extrabold text-xl text-gray-950 hover:text-orange-600 transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-orange-600 font-semibold italic">
                    {pkg.tagline}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wide">Included Highlights:</span>
                  <ul className="text-xs text-gray-750 space-y-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    {pkg.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Included & Not Included Requirements block */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50/30 rounded-xl border border-orange-100/50 text-[11px] leading-normal">
                  <div>
                    <span className="font-bold text-gray-950 block mb-1">Included:</span>
                    <ul className="space-y-1 text-gray-800">
                      <li className="flex items-center gap-1 text-emerald-700">✓ Private Vehicle</li>
                      <li className="flex items-center gap-1 text-emerald-700">✓ Professional Driver</li>
                      <li className="flex items-center gap-1 text-emerald-700">✓ Fuel</li>
                      <li className="flex items-center gap-1 text-emerald-700">✓ Expressway Charges</li>
                      <li className="flex items-center gap-1 text-emerald-700">✓ Parking</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-gray-950 block mb-1">Not Included:</span>
                    <ul className="space-y-1 text-gray-650">
                      <li className="flex items-center gap-1 text-rose-700">✗ Hotel Accommodation</li>
                      <li className="flex items-center gap-1 text-rose-700">✗ Entrance Tickets</li>
                      <li className="flex items-center gap-1 text-rose-700">✗ Safari Jeep Fees</li>
                      <li className="flex items-center gap-1 text-rose-700">✗ Meals & Beverages</li>
                      <li className="flex items-center gap-1 text-rose-700">✗ Personal Expenses</li>
                    </ul>
                  </div>
                </div>

                {/* Stops Breadcrumb */}
                <div className="flex items-center gap-1 flex-wrap text-[10px] font-mono text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  {pkg.stops.map((stop, i) => (
                    <React.Fragment key={stop}>
                      <span className="font-bold text-gray-700">{stop}</span>
                      {i < pkg.stops.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-gray-400" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Pricing and Action row */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-gray-400 font-extrabold">Starting From</span>
                    <span className="font-display font-black text-xl text-gray-900">{formatPrice(pkg.price_base)}</span>
                  </div>
                  <button
                    onClick={() => handleSelectTour(pkg)}
                    className="px-5 py-2.5 bg-gray-950 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    Configure <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Booking Configurator Panel */}
      <span id="booking-anchor"></span>
      {selectedTour && (
        <section className="py-10 bg-white border-t border-b border-gray-150 text-left">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-gray-100 pb-5">
              <span className="text-xs font-extrabold text-orange-600 font-mono tracking-widest uppercase block">
                Itinerary Configurator
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-gray-950 mt-1">
                Customize Your "{selectedTour.name}"
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Configure your start date, travellers count, vehicle class, and submit your verified private inquiry.
              </p>
            </div>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-display font-extrabold text-lg text-emerald-950">Tour Inquiry Received Successfully!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  We have successfully registered your custom tour request! Your coordinator will check hotel options and coordinate vehicle dispatches. Check status instantly in your <strong>My Bookings</strong> dashboard!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left side inputs: parameters config */}
                <div className="md:col-span-2 space-y-6">

                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                      Tour Starting Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none"
                      />
                      <Calendar className="w-4 h-4 text-orange-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Traveller Volume & Dynamic Passenger Logic */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                      Number of Travellers
                    </label>
                    <div className="relative">
                      <select
                        value={travellersCount}
                        onChange={(e) => setTravellersCount(parseInt(e.target.value))}
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-pointer focus:outline-none appearance-none font-mono"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                      <Users className="w-4 h-4 text-orange-500 absolute left-3 top-3.5" />
                    </div>

                    {/* Passenger Dynamic Feedback Badge */}
                    <div className="p-3 bg-slate-50 border border-gray-150 rounded-xl flex items-start gap-2.5 text-xs">
                      <Info className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                      <div>
                        {travellersCount <= 2 && (
                          <>
                            <span className="font-bold text-gray-900 block">Economy Vehicle Match (1-2 Travellers)</span>
                            <span className="text-[11px] text-gray-500">Perfect fit for small groups. No additional transport capacity charge.</span>
                          </>
                        )}
                        {travellersCount >= 3 && travellersCount <= 4 && (
                          <>
                            <span className="font-bold text-gray-900 block">Standard Vehicle Recommended (3-4 Travellers)</span>
                            <span className="text-[11px] text-gray-500">Includes larger sedan upgrade. Capacity charge of <strong>+10,000 LKR</strong> applied automatically.</span>
                          </>
                        )}
                        {travellersCount >= 5 && travellersCount <= 7 && (
                          <>
                            <span className="font-bold text-gray-900 block">Premium Van Required (5-7 Travellers)</span>
                            <span className="text-[11px] text-gray-500">Required for comfortable luggage & seating space. Capacity charge of <strong>+45,000 LKR</strong> applied automatically.</span>
                          </>
                        )}
                        {travellersCount >= 8 && travellersCount <= 10 && (
                          <>
                            <span className="font-bold text-gray-900 block">Large Passenger Van Required (8-10 Travellers)</span>
                            <span className="text-[11px] text-gray-500">Ensures absolute passenger and cargo comfort. Capacity charge of <strong>+70,000 LKR</strong> applied automatically.</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Selection Section */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                      Vehicle Class Selection
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'economy',
                          name: 'Economy',
                          models: ['Suzuki Wagon R', 'Suzuki Japan Alto'],
                          priceLabel: '+0 LKR'
                        },
                        {
                          id: 'standard',
                          name: 'Standard',
                          models: ['Toyota Axio Hybrid', 'Toyota Prius'],
                          priceLabel: '+25,000 LKR'
                        },
                        {
                          id: 'premium',
                          name: 'Premium',
                          models: ['Toyota KDH', 'Nissan Caravan'],
                          priceLabel: '+65,000 LKR'
                        }
                      ].map((vOpt) => (
                        <button
                          key={vOpt.id}
                          type="button"
                          onClick={() => setVehicleTier(vOpt.id as any)}
                          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer h-32 ${vehicleTier === vOpt.id ? 'border-orange-500 bg-orange-50/50 text-orange-950' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-850'}`}
                        >
                          <div>
                            <span className="text-xs font-bold block mb-1 text-gray-950">{vOpt.name}</span>
                            <ul className="text-[10px] text-gray-500 list-disc pl-3.5 space-y-0.5">
                              {vOpt.models.map(m => <li key={m}>{m}</li>)}
                            </ul>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-orange-600 block mt-2 uppercase">{vOpt.priceLabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special customization instructions */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                      Special requests & Customizations
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="E.g., child seat, specific pick-up time details, route modifications..."
                      rows={3}
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                </div>

                {/* Right side calculation block */}
                <div className="bg-gray-950 text-white rounded-2xl p-6 space-y-6 flex flex-col justify-between h-fit sticky top-24 border border-white/5">
                  <div className="space-y-4">
                    <span className="text-xs font-extrabold text-orange-400 font-mono tracking-widest uppercase block">
                      Estimate Calculation
                    </span>

                    <div className="space-y-2 border-b border-white/10 pb-4">
                      <span className="text-sm font-bold block text-white">{selectedTour.name}</span>
                      <span className="text-xs text-gray-400 block">{selectedTour.duration}</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-gray-400">
                      <div className="flex justify-between">
                        <span>Starting From:</span>
                        <span className="text-white">{formatPrice(selectedTour.price_base)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicle Upgrade ({vehicleTier.toUpperCase()}):</span>
                        <span className="text-white">+{formatPrice(getVehicleTierCharge(vehicleTier))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passenger Group Adjust:</span>
                        <span className="text-white">+{formatPrice(getPassengerCharge(travellersCount))}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-1">
                      <span className="block text-[10px] uppercase font-mono text-gray-400 tracking-wide font-bold">Total Estimated Inquiry Cost</span>
                      <span className="font-display font-black text-2xl text-orange-500 block">
                        {formatPrice(calculateTotalPrice(selectedTour))}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-sans">Includes taxes, professional driver, fuel, tolls, and parking.</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    {error && (
                      <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-[11px] text-rose-300 leading-normal">
                        {error}
                      </div>
                    )}


                   
                    {!currentUser && (
                      <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 space-y-3">
                        <span className="block text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">
                          Guest Contact Details
                        </span>
                        <div>
                          <label className="block text-[10px] text-gray-300 font-mono uppercase mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={guestName} 
                            onChange={(e) => setGuestName(e.target.value)} 
                            placeholder="E.g., John Doe" 
                            required
                            className="w-full p-2.5 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-300 font-mono uppercase mb-1">Contact Number (WhatsApp)</label>
                          <input 
                            type="text" 
                            value={guestPhone} 
                            onChange={(e) => setGuestPhone(e.target.value)} 
                            placeholder="+94 7X XXX XXXX" 
                            required
                            className="w-full p-2.5 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    )}



                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'Dispatching...' : 'Request Tour Package'}
                      </button>
                

                    <span className="block text-[10px] text-gray-400 text-center font-sans">
                      💡 No advance payment required. Coordinator will message you on WhatsApp to finalize the itinerary.
                    </span>
                  </div>

                </div>

              </form>
            )}
          </div>
        </section>
      )}

      {/* Safety / Chauffeur Standard blocks */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="p-6 bg-white border border-gray-150 rounded-2xl space-y-3 shadow-xs">
          <Landmark className="w-8 h-8 text-orange-600" />
          <h4 className="font-display font-bold text-gray-950 text-base">Government Tourist Drivers</h4>
          <p className="text-xs text-gray-550 leading-relaxed">
            All assigned chauffeurs are certified by the Sri Lanka Tourism Development Authority (SLTDA). They possess deep knowledge of heritage sites and local shortcuts.
          </p>
        </div>

        <div className="p-6 bg-white border border-gray-150 rounded-2xl space-y-3 shadow-xs">
          <TreePine className="w-8 h-8 text-orange-600" />
          <h4 className="font-display font-bold text-gray-950 text-base">Custom Tailored Stops</h4>
          <p className="text-xs text-gray-550 leading-relaxed">
            Want to swap a safari for a surfing lesson? Your private coordinator can rearrange the landmarks or build custom stops seamlessly over WhatsApp with zero extra coordinator fees.
          </p>
        </div>

        <div className="p-6 bg-white border border-gray-150 rounded-2xl space-y-3 shadow-xs">
          <HeartHandshake className="w-8 h-8 text-orange-600" />
          <h4 className="font-display font-bold text-gray-950 text-base">Transparent Refund Policy</h4>
          <p className="text-xs text-gray-550 leading-relaxed">
            Cancel for free up to 72 hours before departure. No credit card pre-authorizations are held until hotel and vehicle dispatch are confirmed in writing.
          </p>
        </div>

      </section>

    </div>
  );
};
