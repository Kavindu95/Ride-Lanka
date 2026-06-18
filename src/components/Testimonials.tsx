import React from 'react';
import { Star, Quote, ShieldAlert, Sparkles } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  highlightCategory: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Ruwan Wijesinghe',
    role: 'Expat, United Kingdom',
    comment: 'Coordinating a rent-a-car during peak winter tourist season in Sri Lanka is usually stressful. RideLanka found me a Prado Land Cruiser in 30 minutes. The WhatsApp integration coordinate group made communicating with the driver perfectly smooth.',
    rating: 5,
    highlightCategory: 'SUV Coordinate'
  },
  {
    id: 't-2',
    name: 'Dilani Perera',
    role: 'Corporate Hostess, Colombo',
    comment: 'We booked a Mercedes E-Class for our executive VIP tour. Excellent experience without pre-payment risks. Safe local owner was verified. Direct and completely honest manual system.',
    rating: 5,
    highlightCategory: 'Luxury Sedan'
  },
  {
    id: 't-3',
    name: 'Shamil Al-Sajid',
    role: 'Wedding Coordinator, Negombo',
    comment: 'Truly Sri Lanka\'s most responsive booking agent system. I can list specifications on WhatsApp and get reliable matches with secure driver identification. Direct coordinate matching with complete transparency.',
    rating: 5,
    highlightCategory: 'Van Operations'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 border-t border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-orange-600 font-mono tracking-widest uppercase block">
            Client Success Testimonials
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight mt-1">
            Endorsed by Selective Travelers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            See how RideLanka\'s dedicated manual WhatsApp dispatch loop delivers seamless, high-class vehicle reservations.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs relative flex flex-col justify-between">
              
              {/* Quote Graphic Icon container */}
              <div className="absolute right-6 top-6 text-gray-100">
                <Quote className="w-10 h-10 rotate-180" />
              </div>

              <div>
                {/* Visual Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                </div>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Row */}
              <div className="flex items-center justify-between border-t border-gray-150 pt-4 mt-4">
                <div>
                  <span className="font-display font-bold text-gray-950 text-sm block">
                    {t.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    {t.role}
                  </span>
                </div>

                {/* highlight sticker tag */}
                <span className="text-[9px] font-mono font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                  {t.highlightCategory}
                </span>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
