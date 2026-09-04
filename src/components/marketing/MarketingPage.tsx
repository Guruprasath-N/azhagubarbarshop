import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Hero3DSlider } from './Hero3DSlider';
import {
  Compass,
  Star,
  ShieldCheck,
  Clock,
  Scissors,
  ArrowRight,
  Sparkles,
  MapPin,
  CalendarCheck,
  Heart,
  Award,
  Navigation,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

interface NearestStudio {
  id: string;
  salonId: string;
  name: string;
  imageUrl: string;
  tag: string;
  category: string;
  categoryGroup: 'ALL' | 'NEAR' | 'BRIDAL' | 'HAIR' | 'MENS' | 'SPA';
  distanceKm: number;
  distanceLabel: string;
  area: string;
  city: string;
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  highlight: string;
}

const NEAREST_STUDIOS: NearestStudio[] = [
  {
    id: 'nst-1',
    salonId: 'salon-1',
    name: 'Azhagu Muhurtham Bridal Studio & Saree Draping',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85',
    tag: 'Muhurtham Specialist',
    category: 'Bridal Makeover',
    categoryGroup: 'BRIDAL',
    distanceKm: 0.8,
    distanceLabel: '0.8 km · 3 min walk',
    area: '2nd Ave, Anna Nagar',
    city: 'Chennai',
    rating: 4.98,
    reviewsCount: 248,
    startingPrice: 4500,
    highlight: '16-Hr Waterproof HD Makeup & Madisar Draping'
  },
  {
    id: 'nst-2',
    salonId: 'salon-2',
    name: 'Kumaran Royal Men’s Grooming & Shave Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=85',
    tag: 'Executive Barber',
    category: 'Men’s Grooming',
    categoryGroup: 'MENS',
    distanceKm: 1.4,
    distanceLabel: '1.4 km · 5 min drive',
    area: 'Pondy Bazaar, T. Nagar',
    city: 'Chennai',
    rating: 4.92,
    reviewsCount: 186,
    startingPrice: 950,
    highlight: 'Hot Sandalwood Shave & Silk Veshti Draping'
  },
  {
    id: 'nst-3',
    salonId: 'salon-6',
    name: 'Sundaram Couture Hair Architecture & Atelier',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=85',
    tag: 'Master Stylist',
    category: 'Hair Architecture',
    categoryGroup: 'HAIR',
    distanceKm: 1.9,
    distanceLabel: '1.9 km · 7 min drive',
    area: 'Khader Nawaz Khan Rd, Nungambakkam',
    city: 'Chennai',
    rating: 4.94,
    reviewsCount: 142,
    startingPrice: 1200,
    highlight: 'Precision Hair Cut & Keratin Silk Glaze'
  },
  {
    id: 'nst-4',
    salonId: 'salon-3',
    name: 'Ponni Heritage Bridal & Mallipoo Floral Spa',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=85',
    tag: 'Temple Heritage',
    category: 'Floral Hair Art',
    categoryGroup: 'BRIDAL',
    distanceKm: 2.2,
    distanceLabel: '2.2 km · 8 min drive',
    area: 'Eldams Road, Alwarpet',
    city: 'Chennai',
    rating: 4.96,
    reviewsCount: 215,
    startingPrice: 1800,
    highlight: 'Madurai Mallipoo Jasmine & Jada Alankaram'
  },
  {
    id: 'nst-5',
    salonId: 'salon-5',
    name: 'Kaveri Kasturi Manjal & Ayurvedic Glow Spa',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=85',
    tag: '100% Herbal',
    category: 'Ayurvedic Skin Spa',
    categoryGroup: 'SPA',
    distanceKm: 2.5,
    distanceLabel: '2.5 km · 9 min drive',
    area: 'Gandhi Nagar, Adyar',
    city: 'Chennai',
    rating: 4.95,
    reviewsCount: 178,
    startingPrice: 2200,
    highlight: 'Kumkumadi Radiance & Wild Turmeric Wrap'
  },
  {
    id: 'nst-6',
    salonId: 'salon-20',
    name: 'Lumière Balayage & Silk Protein Hair Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=85',
    tag: 'Color Atelier',
    category: 'Hair Transformation',
    categoryGroup: 'HAIR',
    distanceKm: 2.8,
    distanceLabel: '2.8 km · 10 min drive',
    area: '2nd Main Rd, Besant Nagar',
    city: 'Chennai',
    rating: 4.91,
    reviewsCount: 135,
    startingPrice: 3800,
    highlight: 'Ammonia-Free Balayage & Silk Shield'
  },
  {
    id: 'nst-7',
    salonId: 'salon-4',
    name: 'Meenakshi Classical Maruthani & Bridal Artistry',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=85',
    tag: 'Bridal Henna',
    category: 'Maruthani & Draping',
    categoryGroup: 'BRIDAL',
    distanceKm: 3.1,
    distanceLabel: '3.1 km · 11 min drive',
    area: '100 Feet Bypass Rd, Velachery',
    city: 'Chennai',
    rating: 4.93,
    reviewsCount: 160,
    startingPrice: 2500,
    highlight: 'Natural Organic Henna & Temple Jewellery'
  },
  {
    id: 'nst-8',
    salonId: 'salon-20',
    name: 'Vedic Kesh Head Spa & Shirodhara Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=85',
    tag: 'Scalp Detox',
    category: 'Botanical Kesh Therapy',
    categoryGroup: 'SPA',
    distanceKm: 3.4,
    distanceLabel: '3.4 km · 12 min drive',
    area: 'Luz Church Rd, Mylapore',
    city: 'Chennai',
    rating: 4.89,
    reviewsCount: 119,
    startingPrice: 1500,
    highlight: 'Warm Virgin Coconut Oil & Scalp Acupressure'
  },
  {
    id: 'nst-9',
    salonId: 'salon-2',
    name: 'The Vintage Razor Barber Club',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=85',
    tag: 'Classic Shave',
    category: 'Men’s Grooming',
    categoryGroup: 'MENS',
    distanceKm: 3.7,
    distanceLabel: '3.7 km · 13 min drive',
    area: 'Cathedral Road, Gopalapuram',
    city: 'Chennai',
    rating: 4.90,
    reviewsCount: 154,
    startingPrice: 750,
    highlight: 'Traditional Cutthroat Shave & Mint Splash'
  },
  {
    id: 'nst-10',
    salonId: 'salon-3',
    name: 'Ananda Temple Jasmine Hair Sanctuary',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85',
    tag: 'Temple Flowers',
    category: 'Floral Hair Art',
    categoryGroup: 'BRIDAL',
    distanceKm: 4.0,
    distanceLabel: '4.0 km · 14 min drive',
    area: 'North Mada St, Mylapore',
    city: 'Chennai',
    rating: 4.97,
    reviewsCount: 202,
    startingPrice: 1900,
    highlight: 'Kanjeevaram Floral Braid & Fragrant Jasmine'
  },
  {
    id: 'nst-11',
    salonId: 'salon-4',
    name: 'Tamirabarani Royal Complexion & Bridal Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
    tag: 'Ultra-HD Bridal',
    category: 'Bridal Makeover',
    categoryGroup: 'BRIDAL',
    distanceKm: 4.2,
    distanceLabel: '4.2 km · 14 min drive',
    area: 'GST Road, Guindy',
    city: 'Chennai',
    rating: 4.92,
    reviewsCount: 168,
    startingPrice: 5200,
    highlight: 'Sweat-Resistant Muhurtham Makeup & Airbrush'
  },
  {
    id: 'nst-12',
    salonId: 'salon-5',
    name: 'Kesh Botanical Root Revival Clinic',
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=85',
    tag: 'Herbal Scalp',
    category: 'Botanical Kesh Therapy',
    categoryGroup: 'SPA',
    distanceKm: 4.5,
    distanceLabel: '4.5 km · 15 min drive',
    area: 'Arcot Road, Vadapalani',
    city: 'Chennai',
    rating: 4.88,
    reviewsCount: 141,
    startingPrice: 1350,
    highlight: 'Shikakai Scalp Wash & Hibiscus Herb Pack'
  },
  {
    id: 'nst-13',
    salonId: 'salon-6',
    name: 'Atelier Nungambakkam Haute Coiffure',
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=85',
    tag: 'Haute Coiffure',
    category: 'Hair Architecture',
    categoryGroup: 'HAIR',
    distanceKm: 4.8,
    distanceLabel: '4.8 km · 16 min drive',
    area: 'College Road, Nungambakkam',
    city: 'Chennai',
    rating: 4.93,
    reviewsCount: 175,
    startingPrice: 1600,
    highlight: 'French Balayage & Brazilian Keratin Finish'
  },
  {
    id: 'nst-14',
    salonId: 'salon-7',
    name: 'Salem Golden Turmeric & Bridal House',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=85',
    tag: 'Pure Turmeric',
    category: 'Ayurvedic Skin Spa',
    categoryGroup: 'SPA',
    distanceKm: 5.1,
    distanceLabel: '5.1 km · 17 min drive',
    area: 'Poonamallee High Rd, Kilpauk',
    city: 'Chennai',
    rating: 4.86,
    reviewsCount: 122,
    startingPrice: 1700,
    highlight: 'Fresh Curcuma Face Glow & Sandalwood Pack'
  },
  {
    id: 'nst-15',
    salonId: 'salon-8',
    name: 'Heritage Henna Artistry & Mehendi Villa',
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=85',
    tag: 'Organic Henna',
    category: 'Maruthani & Draping',
    categoryGroup: 'BRIDAL',
    distanceKm: 5.3,
    distanceLabel: '5.3 km · 18 min drive',
    area: 'Sardar Patel Road, Guindy',
    city: 'Chennai',
    rating: 4.95,
    reviewsCount: 189,
    startingPrice: 2100,
    highlight: 'Dark Mahogany Stain Herbal Maruthani'
  },
  {
    id: 'nst-16',
    salonId: 'salon-9',
    name: 'Chola Royal Bridal Saree & Silk Pleating',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=85',
    tag: 'Chola Heritage',
    category: 'Bridal Makeover',
    categoryGroup: 'BRIDAL',
    distanceKm: 5.6,
    distanceLabel: '5.6 km · 19 min drive',
    area: 'Alagappa Road, Purasawalkam',
    city: 'Chennai',
    rating: 4.96,
    reviewsCount: 220,
    startingPrice: 6500,
    highlight: '24K Gold Dust Pre-Bridal & Madisar Pleating'
  },
  {
    id: 'nst-17',
    salonId: 'salon-10',
    name: 'French Quarter Seaside Botanical Salon',
    imageUrl: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=800&q=85',
    tag: 'Seaside Spa',
    category: 'Hair Architecture',
    categoryGroup: 'HAIR',
    distanceKm: 5.9,
    distanceLabel: '5.9 km · 20 min drive',
    area: 'ECR Thiruvanmiyur Beach',
    city: 'Chennai',
    rating: 4.90,
    reviewsCount: 167,
    startingPrice: 2400,
    highlight: 'Sea Mineral Scalp Detox & French Lavender'
  },
  {
    id: 'nst-18',
    salonId: 'salon-11',
    name: 'Golden Radiance Facial & Sripuram Spa',
    imageUrl: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=800&q=85',
    tag: '24K Gold Leaf',
    category: 'Ayurvedic Skin Spa',
    categoryGroup: 'SPA',
    distanceKm: 6.2,
    distanceLabel: '6.2 km · 21 min drive',
    area: 'Velachery Main Road, Medavakkam',
    city: 'Chennai',
    rating: 4.88,
    reviewsCount: 133,
    startingPrice: 1950,
    highlight: 'Gold Foil Facial Infusion & Neck Polish'
  },
  {
    id: 'nst-19',
    salonId: 'salon-12',
    name: 'Erode Turmeric Silk Bridal Makeovers',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85',
    tag: 'Turmeric Silk',
    category: 'Bridal Makeover',
    categoryGroup: 'BRIDAL',
    distanceKm: 6.5,
    distanceLabel: '6.5 km · 22 min drive',
    area: 'Old Mahabalipuram Rd, OMR Perungudi',
    city: 'Chennai',
    rating: 4.91,
    reviewsCount: 152,
    startingPrice: 4800,
    highlight: 'Sun-Kissed Golden Muhurtham Complexion'
  },
  {
    id: 'nst-20',
    salonId: 'salon-14',
    name: 'Kanchipuram Silk Saree Draping & Muhurtham Studio',
    imageUrl: 'https://images.unsplash.com/photo-1500840216050-6ffa99d75160?auto=format&fit=crop&w=800&q=85',
    tag: 'Kanchi Silk Master',
    category: 'Maruthani & Draping',
    categoryGroup: 'BRIDAL',
    distanceKm: 6.8,
    distanceLabel: '6.8 km · 23 min drive',
    area: 'Mogappair West, Ambattur',
    city: 'Chennai',
    rating: 4.99,
    reviewsCount: 310,
    startingPrice: 5500,
    highlight: 'Master 9-Yard Madisar Draping & Temple Jewels'
  },
  {
    id: 'nst-21',
    salonId: 'salon-21',
    name: 'Meenakshi Temple Jasmine & Bridal Alankaram Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=85',
    tag: 'Temple Heritage',
    category: 'Maruthani & Draping',
    categoryGroup: 'BRIDAL',
    distanceKm: 7.1,
    distanceLabel: '7.1 km · 24 min drive',
    area: 'South Chithirai Street, Near Temple South Gate',
    city: 'Madurai',
    rating: 4.98,
    reviewsCount: 194,
    startingPrice: 6800,
    highlight: 'Madurai Malli Braid, Temple Jewelry & HD Makeup'
  }
];

export const MarketingPage: React.FC = () => {
  const { setCurrentView, salons, categories, navigateToSalon } = useApp();
  const { switchRole } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'NEAR' | 'BRIDAL' | 'HAIR' | 'MENS' | 'SPA'>('ALL');

  const filteredStudios = NEAREST_STUDIOS.filter((st) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'NEAR') return st.distanceKm <= 2.0;
    return st.categoryGroup === selectedFilter;
  });

  return (
    <div className="bg-neutral-50 min-h-screen text-neutral-900 font-sans">
      {/* 1. HERO SECTION WITH LUXURY ARCHITECTURAL SALON BACKGROUND & 3D SLIDER */}
      <section className="relative overflow-hidden border-b border-neutral-200 pt-12 pb-14 px-4 sm:px-6 lg:px-10 bg-neutral-950">
        {/* Professional High-Res 4K Luxury Salon Architecture Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2560&q=90"
            alt="Luxury Architectural Salon Studio Interior"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105"
            referrerPolicy="no-referrer"
          />
          {/* Multi-layered Professional Studio Lighting & Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/96 via-neutral-950/85 to-neutral-950/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
          {/* Spatial Warm Amber & Golden Halo Spotlights */}
          <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-amber-600/10 blur-3xl rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900/90 border border-amber-400/30 rounded-sm text-xs font-mono text-amber-300 mb-4 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                AZHAGU · South India’s Premier Salon & Bridal Platform
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight mb-4 drop-shadow-sm">
                Tamil Nadu’s Finest Grooming & <br />
                <span className="font-semibold text-amber-200">Temple Bridal Artistry.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed mb-6 drop-shadow-xs">
                Discover authentic South Indian Muhurtham bridal studios, luxury hair craft lounges, herbal Kasturi Manjal spas, and classic men’s salons across Chennai, Coimbatore, Madurai, and Trichy. Instant slot booking with verified stylists.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="hero-btn-explore"
                  onClick={() => setCurrentView('DISCOVER')}
                  className="px-5 py-2.5 bg-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  Explore Salons in Tamil Nadu
                </button>
                <button
                  id="hero-btn-owner-demo"
                  onClick={() => {
                    switchRole('SALON_OWNER');
                    setCurrentView('SALON_DASHBOARD');
                  }}
                  className="px-4 py-2.5 bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-white/20 border border-white/20 backdrop-blur-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scissors className="w-4 h-4 text-amber-400" />
                  Salon Owner Portal
                </button>
              </div>

              {/* City Badges */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                <span className="font-medium text-neutral-200">Popular Hubs:</span>
                <span className="px-2 py-0.5 bg-white/10 border border-white/10 rounded-xs text-neutral-200 font-mono">Chennai (Anna Nagar, T. Nagar)</span>
                <span className="px-2 py-0.5 bg-white/10 border border-white/10 rounded-xs text-neutral-200 font-mono">Coimbatore (R.S. Puram)</span>
                <span className="px-2 py-0.5 bg-white/10 border border-white/10 rounded-xs text-neutral-200 font-mono">Madurai (KK Nagar)</span>
                <span className="px-2 py-0.5 bg-white/10 border border-white/10 rounded-xs text-neutral-200 font-mono">Trichy</span>
              </div>
            </div>

            {/* Quick Metrics & Trust Card */}
            <div className="w-full lg:w-80 bg-neutral-900/80 backdrop-blur-md border border-white/15 rounded-md p-5 space-y-4 flex-none shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase text-neutral-400">AZHAGU Booking Engine</span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 border border-emerald-500/40 rounded-xs">Verified Live</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-white">
                <div>
                  <p className="text-xl font-light text-amber-300">100%</p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-tight">Zero Double-Booking</p>
                </div>
                <div>
                  <p className="text-xl font-light text-amber-300">500+</p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-tight">Muhurtham Weddings</p>
                </div>
                <div>
                  <p className="text-xl font-light text-amber-300">4.9 ★</p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-tight">Client Rating</p>
                </div>
                <div>
                  <p className="text-xl font-light text-amber-300">6 Cities</p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-tight">South India</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Authentic Stylists
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Traditional Rituals
                </span>
              </div>
            </div>
          </div>

          {/* 3D HERO SLIDER SHOWCASE */}
          <div className="mt-4 pt-6 border-t border-white/10">
            <Hero3DSlider />
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE WITH DISTINCT 3D SALON BACKGROUND IMAGE */}
      <section className="relative overflow-hidden py-20 px-6 lg:px-10 border-b border-neutral-800 bg-neutral-950">
        {/* Distinct 3D Architectural Salon Studio Interior with Circular Halo Mirrors & Warm Ambiance */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=2560&q=90"
            alt="Haute Coiffure & Luxury Salon Atelier Architecture"
            className="w-full h-full object-cover object-center scale-105 filter contrast-105 brightness-95"
            referrerPolicy="no-referrer"
          />
          {/* Subtle 3D Depth & Vignette Overlay so the architectural salon background is clearly visible */}
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/60 via-transparent to-neutral-950/80" />
          {/* Spatial 3D Golden Ambient Glow Orbs */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-400/15 blur-3xl rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900/90 border border-amber-400/30 rounded-xs text-[10px] font-mono uppercase tracking-wider text-amber-300 mb-3 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>South Indian Specializations · 3D Atelier</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white drop-shadow-sm">
                Crafted for Every Occasion & Routine
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal mt-1 max-w-xl">
                Select your signature care discipline—from traditional Muhurtham temple bridals to precision botanical scalp rituals.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('DISCOVER')}
              className="px-4 py-2.5 bg-white/10 hover:bg-amber-500 text-white hover:text-neutral-950 border border-white/20 hover:border-amber-400 rounded-sm text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg group self-start md:self-auto"
            >
              <span>Browse All Services</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setCurrentView('DISCOVER')}
                className="group relative p-5 bg-neutral-900/75 hover:bg-neutral-900/95 backdrop-blur-md border border-white/15 hover:border-amber-400/80 rounded-lg hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle Card Background Glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 group-hover:bg-amber-500/25 blur-xl rounded-full transition-all duration-300 pointer-events-none" />

                <div>
                  <div className="w-14 h-14 rounded-md overflow-hidden mb-4 border border-white/20 shadow-md flex-none relative bg-neutral-950">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors mb-1.5 leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400 group-hover:text-amber-300 transition-colors">
                  <span>Explore Rituals</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEAREST 20 SALONS & BEAUTY SHOWCASE */}
      <section className="relative overflow-hidden py-16 px-6 lg:px-10 border-b border-neutral-200 bg-neutral-50">
        {/* Subtle High-End Beauty Studio Interior Atmosphere Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2560&q=90"
            alt="Premier Bridal & Beauty Studio Atmosphere"
            className="w-full h-full object-cover object-center scale-105 opacity-[0.14] filter contrast-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/94 via-neutral-50/88 to-stone-50/96" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-amber-200/25 blur-3xl rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-100/80 border border-amber-300/80 rounded-xs text-[10px] font-mono uppercase tracking-wider text-amber-900 mb-2 shadow-2xs">
                <Navigation className="w-3 h-3 text-amber-700" />
                <span>Proximity Radar · Tamil Nadu</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-950">
                Nearest Premier Salons & Beauty Studios
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Curated authentic studios closest to your location with verified stylists and instant slot booking.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 bg-white border border-neutral-200 rounded-sm text-xs text-neutral-700 flex items-center gap-1.5 shadow-2xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Current: Anna Nagar, Chennai</span>
              </div>
              <button
                onClick={() => setCurrentView('DISCOVER')}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Browse All Salons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-200 text-xs no-scrollbar">
            <span className="text-neutral-500 font-mono text-[11px] uppercase mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer text-xs whitespace-nowrap ${
                selectedFilter === 'ALL'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              All 21 Studios
            </button>
            <button
              onClick={() => setSelectedFilter('NEAR')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer text-xs whitespace-nowrap ${
                selectedFilter === 'NEAR'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Under 2 km (Walking / 5 min)
            </button>
            <button
              onClick={() => setSelectedFilter('BRIDAL')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer text-xs whitespace-nowrap ${
                selectedFilter === 'BRIDAL'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Muhurtham Bridal Artistry
            </button>
            <button
              onClick={() => setSelectedFilter('HAIR')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer text-xs whitespace-nowrap ${
                selectedFilter === 'HAIR'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Hair Craft & Color Lounge
            </button>
            <button
              onClick={() => setSelectedFilter('MENS')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer text-xs whitespace-nowrap ${
                selectedFilter === 'MENS'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Royal Men’s Grooming
            </button>
            <button
              onClick={() => setSelectedFilter('SPA')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer text-xs whitespace-nowrap ${
                selectedFilter === 'SPA'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Ayurvedic Skin & Head Spa
            </button>
          </div>

          {/* 8 Distinct Attractive Salon & Beauty Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStudios.map((studio) => (
              <div
                key={studio.id}
                className="bg-white border border-neutral-200 rounded-sm overflow-hidden flex flex-col hover:border-amber-600/70 hover:shadow-md transition-all group duration-300"
              >
                {/* Visual Image Container */}
                <div className="h-52 relative overflow-hidden bg-neutral-950">
                  <img
                    src={studio.imageUrl}
                    alt={studio.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Atmospheric Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/30 pointer-events-none" />

                  {/* Top-Left Distance Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-neutral-950/85 backdrop-blur-md border border-white/20 text-emerald-300 font-mono text-[11px] font-semibold px-2 py-0.5 rounded-xs flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{studio.distanceLabel}</span>
                  </div>

                  {/* Top-Right Rating */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-xs text-xs font-mono font-semibold flex items-center gap-1 text-neutral-950 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{studio.rating}</span>
                    <span className="text-neutral-400 text-[10px]">({studio.reviewsCount})</span>
                  </div>

                  {/* Bottom-Left Specialization Tag */}
                  <div className="absolute bottom-2.5 left-2.5 bg-neutral-950/90 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-xs text-[10px] font-mono tracking-wide uppercase">
                    {studio.tag}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-medium text-amber-800 uppercase tracking-wide mb-1">
                      {studio.category}
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-950 leading-snug group-hover:text-amber-700 transition-colors line-clamp-1 mb-1">
                      {studio.name}
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mb-2.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-none" />
                      <span>{studio.area}, {studio.city}</span>
                    </p>

                    {/* Highlight Box */}
                    <div className="text-[11px] text-neutral-700 bg-neutral-50 border border-neutral-200/80 rounded-xs px-2.5 py-1.5 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-none" />
                      <span className="truncate">{studio.highlight}</span>
                    </div>
                  </div>

                  {/* Price & Booking Button */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Starting At</span>
                      <span className="text-sm font-semibold text-neutral-950">₹{studio.startingPrice.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => navigateToSalon(studio.salonId)}
                      className="px-3.5 py-2 bg-neutral-950 hover:bg-amber-600 text-white text-xs font-semibold rounded-sm transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Proximity Guarantee Footer */}
          <div className="mt-8 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-time proximity matching: Guaranteed zero double-booking on all nearest partner salons.</span>
            </div>
            <button
              onClick={() => setCurrentView('DISCOVER')}
              className="text-neutral-900 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all Tamil Nadu cities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW AZHAGU WORKS */}
      <section className="relative overflow-hidden py-16 px-6 lg:px-10 border-b border-neutral-200 bg-white">
        {/* Serene Wellness & Botanical Spa Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2560&q=90"
            alt="Botanical Ayurvedic Wellness Spa Background"
            className="w-full h-full object-cover object-center scale-105 opacity-[0.10] filter contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-stone-50/90 to-white/95" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/30 blur-3xl rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-widest block mb-1 font-mono">
              Frictionless Booking
            </span>
            <h2 className="text-2xl font-light text-neutral-900">How AZHAGU Works for You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white/85 backdrop-blur-md border border-neutral-200/90 rounded-sm shadow-2xs hover:shadow-md transition-all hover:border-amber-400/60 group">
              <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold mb-4 group-hover:bg-amber-600 transition-colors">
                01
              </div>
              <h3 className="text-sm font-semibold text-neutral-950 mb-2">Explore Tamil Nadu Studios</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Filter by city (Chennai, Coimbatore, Madurai, Trichy), Muhurtham bridal packages, men’s groom styling, or rating.
              </p>
            </div>

            <div className="p-6 bg-white/85 backdrop-blur-md border border-neutral-200/90 rounded-sm shadow-2xs hover:shadow-md transition-all hover:border-amber-400/60 group">
              <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold mb-4 group-hover:bg-amber-600 transition-colors">
                02
              </div>
              <h3 className="text-sm font-semibold text-neutral-950 mb-2">Pick Master Stylists</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                View experienced saree draping specialists, master barbers, and Ayurvedic dermal therapists.
              </p>
            </div>

            <div className="p-6 bg-white/85 backdrop-blur-md border border-neutral-200/90 rounded-sm shadow-2xs hover:shadow-md transition-all hover:border-amber-400/60 group">
              <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold mb-4 group-hover:bg-amber-600 transition-colors">
                03
              </div>
              <h3 className="text-sm font-semibold text-neutral-950 mb-2">Instant Real-Time Lock</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Real-time slot engine checks salon hours, stylist shifts, and leave blocks to ensure instant confirmation.
              </p>
            </div>

            <div className="p-6 bg-white/85 backdrop-blur-md border border-neutral-200/90 rounded-sm shadow-2xs hover:shadow-md transition-all hover:border-amber-400/60 group">
              <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center text-xs font-mono font-bold mb-4 group-hover:bg-amber-600 transition-colors">
                04
              </div>
              <h3 className="text-sm font-semibold text-neutral-950 mb-2">Zero Queue Walk-In</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Enjoy your appointment with zero waiting in queue. Rate your experience and support local artists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOR SALON OWNERS SAAS CALLOUT */}
      <section className="relative overflow-hidden py-16 px-6 lg:px-10 bg-neutral-950 text-white border-t border-neutral-800">
        {/* Luxury Executive Salon Management Suite Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2560&q=90"
            alt="Luxury Executive Salon Management Suite"
            className="w-full h-full object-cover object-center scale-105 filter brightness-85 contrast-110"
            referrerPolicy="no-referrer"
          />
          {/* Executive Multi-Layer Obsidian & Amber Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/96 via-neutral-950/88 to-amber-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
          <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block mb-2 font-mono">
              For South Indian Salon Owners & Bridal Studios
            </span>
            <h2 className="text-3xl font-light tracking-tight mb-4 drop-shadow-sm">
              Empower your salon with AZHAGU OS.
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-normal">
              Complete staff roster scheduling, real-time booking management, automated leave blackout rules, dynamic service catalogs, and instant revenue analytics.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-300">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/80 border border-white/10 rounded-xs backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Staff Roster Sync
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/80 border border-white/10 rounded-xs backdrop-blur-md">
                <Clock className="w-4 h-4 text-emerald-400" />
                Leave Blackouts
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/80 border border-white/10 rounded-xs backdrop-blur-md">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                Status Lifecycle
              </div>
            </div>
          </div>

          <div className="flex-none">
            <button
              onClick={() => {
                switchRole('SALON_OWNER');
                setCurrentView('SALON_DASHBOARD');
              }}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xl"
            >
              Open Salon Manager Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
