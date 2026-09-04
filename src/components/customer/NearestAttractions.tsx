import React, { useState } from 'react';
import { Salon } from '../../types';
import {
  MapPin,
  Star,
  Sparkles,
  Gift,
  ArrowRight,
  Phone,
  Navigation,
  Check,
  Copy,
  Clock,
  Scissors
} from 'lucide-react';

interface NearestAttractionsProps {
  salons: Salon[];
  currentSalonId?: string;
  onNavigateToSalon: (salonId: string) => void;
}

// Attraction perks mapped to attract customers for repeat & nearby bookings
const ATTRACTION_PERKS: Record<string, { perk: string; promoCode: string; discount: string; highlight: string }> = {
  'salon-1': {
    perk: 'Complimentary Hibiscus Scalp Rejuvenation Wash with any haircut',
    promoCode: 'AZHAGU15',
    discount: '15% OFF',
    highlight: 'Anna Nagar Flagship Atelier'
  },
  'salon-2': {
    perk: 'Complimentary Hot Eucalyptus Towel & Sandalwood Beard Balm',
    promoCode: 'ROYALSHAVE',
    discount: '₹150 OFF',
    highlight: 'Gentlemen’s Grooming Sanctuary'
  },
  'salon-3': {
    perk: 'Free Madurai Jasmine Floral Garland Hair Braiding Alankaram',
    promoCode: 'BRIDALGLOW',
    discount: '20% OFF',
    highlight: 'Bridal & Saree Draping Lounge'
  },
  'salon-4': {
    perk: 'Complimentary Activated Charcoal Beard Detox & Styling Scrub',
    promoCode: 'SIRPI10',
    discount: 'Flat ₹100 OFF',
    highlight: 'Precision Fade Masters'
  },
  'salon-5': {
    perk: 'Complimentary Kasturi Manjal Organic Turmeric Glow Scrub Sample',
    promoCode: 'KASTURI20',
    discount: '20% OFF',
    highlight: 'Ayurvedic Botanical Spa'
  },
  'salon-6': {
    perk: 'Complimentary Brahmi Herbal Steam Infusion with any Hair Spa',
    promoCode: 'VAIGAI15',
    discount: '15% OFF',
    highlight: 'Organic Hair Wellness'
  },
  'salon-7': {
    perk: 'Complimentary Kanjeevaram Saree Pleating & Pallu Setting Session',
    promoCode: 'MADURAILUX',
    discount: '₹300 OFF',
    highlight: 'Temple City Heritage Studio'
  },
  'salon-8': {
    perk: 'Free Deep Keratin Silk Protein Nourishing Hair Mask',
    promoCode: 'KOVAISILK',
    discount: 'Flat ₹200 OFF',
    highlight: 'Silk City Artisans'
  },
  'salon-9': {
    perk: 'Complimentary Cold Sandalwood Scalp Cooling Pack & Foot Acupressure',
    promoCode: 'THILLAI10',
    discount: '10% OFF',
    highlight: 'Chidambaram Heritage Craft'
  },
  'salon-10': {
    perk: 'Complimentary 24K Gold Dust Radiance De-Tan Add-On Ritual',
    promoCode: 'CAUVERYGLOW',
    discount: '₹250 OFF',
    highlight: 'Trichy Riverside Sanctuary'
  }
};

// Fallback attraction perk for other salons
const DEFAULT_PERK = {
  perk: 'Complimentary Herbal Tea & 15-Minute Scalp Massage',
  promoCode: 'TAMILAZHAGU',
  discount: '15% OFF',
  highlight: 'Certified Partner Studio'
};

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

export const NearestAttractions: React.FC<NearestAttractionsProps> = ({
  salons,
  currentSalonId = 'salon-1',
  onNavigateToSalon
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Reference coordinates (Anna Nagar Chennai where appt-101 is located)
  const currentSalon = salons.find((s) => s.id === currentSalonId) || salons[0];
  const refLat = currentSalon?.latitude || 13.085;
  const refLng = currentSalon?.longitude || 80.2101;

  // Calculate distances for all salons and sort to get nearest 10
  const nearest10Salons = [...salons]
    .map((salon) => {
      let distance = calculateDistanceKm(
        refLat,
        refLng,
        salon.latitude,
        salon.longitude
      );
      // Give the current salon a natural 0.8 km proximity tag if it's the anchor
      if (salon.id === currentSalonId) {
        distance = 0.8;
      }
      const perkData = ATTRACTION_PERKS[salon.id] || DEFAULT_PERK;
      return {
        ...salon,
        distance,
        perkData
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((curr) => (curr === code ? null : curr));
    }, 2500);
  };

  return (
    <div id="nearest-10-customer-attraction" className="space-y-6 pt-4">
      {/* Attraction Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 rounded-sm p-5 sm:p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono tracking-wider uppercase font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Exclusive Customer Attraction Engine · Nearest 10 Studios
            </div>
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
              Nearest 10 Studios & Exclusive Member Perks
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Curated by proximity to your current reservation in <strong className="text-white">{currentSalon?.city || 'Chennai'}</strong>. Enjoy priority slot access and special client attraction perks across Tamil Nadu’s top-rated studios.
            </p>
          </div>

          <div className="flex-none bg-neutral-800/80 border border-neutral-700/60 p-3 rounded-sm text-center">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">Radius Covered</span>
            <span className="text-lg font-bold text-amber-400 font-mono">0.8 km – 8.5 km</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">10 Verified Studios</span>
          </div>
        </div>
      </div>

      {/* Grid of Nearest 10 Studios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearest10Salons.map((salon, index) => (
          <div
            key={salon.id}
            id={`attraction-salon-${salon.id}`}
            className={`bg-white border rounded-sm p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-md ${
              salon.id === currentSalonId
                ? 'border-amber-400/90 ring-1 ring-amber-400/40'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <div className="space-y-3">
              {/* Card Top Strip: Rank, Distance & Discount Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white font-mono text-[11px] font-bold flex items-center justify-center flex-none">
                    #{index + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono font-semibold rounded-xs">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {salon.distance < 1 ? 'Within 1 km' : `${salon.distance} km away`}
                  </span>
                  {salon.id === currentSalonId && (
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-mono font-bold rounded-xs border border-amber-200">
                      Current Booking Studio
                    </span>
                  )}
                </div>

                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                  {salon.perkData.discount}
                </span>
              </div>

              {/* Studio Info with Thumbnail */}
              <div className="flex items-start gap-3">
                <img
                  src={salon.cover_image_url}
                  alt={salon.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xs border border-neutral-200 flex-none"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block truncate">
                    {salon.perkData.highlight}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-neutral-950 truncate leading-snug">
                    {salon.name}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {salon.address}, {salon.city}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-neutral-900 font-mono text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {salon.rating.toFixed(1)}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {salon.review_count} verified reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Attraction Perk Highlight */}
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-xs p-2.5 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-600 flex-none mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-900 block text-[11px] uppercase font-mono">
                      Member Attraction Perk:
                    </span>
                    <p className="text-neutral-800 text-xs leading-relaxed font-medium">
                      {salon.perkData.perk}
                    </p>
                  </div>
                </div>

                <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-mono text-[10px]">Attraction Coupon:</span>
                  <button
                    onClick={() => handleCopy(salon.perkData.promoCode)}
                    className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 hover:text-amber-950 bg-white px-2 py-0.5 rounded-xs border border-amber-300 cursor-pointer text-[10px]"
                    title="Click to copy promo code"
                  >
                    {copiedCode === salon.perkData.promoCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-amber-600" />
                        <span>{salon.perkData.promoCode}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
              <a
                href={`tel:${salon.phone}`}
                className="px-2.5 py-1.5 text-[11px] text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1"
                title={`Call ${salon.phone}`}
              >
                <Phone className="w-3 h-3 text-neutral-400" />
                <span className="hidden sm:inline">Call Studio</span>
              </a>

              <button
                onClick={() => onNavigateToSalon(salon.id)}
                className="px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book at Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
