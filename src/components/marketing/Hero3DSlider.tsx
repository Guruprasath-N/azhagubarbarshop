import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface BeautySlide {
  id: string;
  salonId: string;
  title: string;
  subtitle: string;
  tag: string;
  category: string;
  location: string;
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  durationMinutes: number;
  imageUrl: string;
  badge: string;
  highlights: string[];
}

const BEAUTY_SLIDES: BeautySlide[] = [
  {
    id: 'b-slide-1',
    salonId: 'salon-1',
    title: 'Muhurtham Bridal Artistry & Saree Draping',
    subtitle: '16-Hour Waterproof HD Makeup, Temple Jewel Styling & 9-Yard Madisar Draping',
    tag: 'Bridal Couture',
    category: 'Muhurtham Specialist',
    location: 'T. Nagar, Chennai',
    rating: 4.98,
    reviewsCount: 248,
    startingPrice: 4500,
    durationMinutes: 120,
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1600&q=90',
    badge: 'Trending Studio',
    highlights: ['Temple Jewel Styling', 'Waterproof HD Finish', 'Madisar Draping']
  },
  {
    id: 'b-slide-2',
    salonId: 'salon-2',
    title: 'Luxury Hair Architecture & Botanical Kesh Spa',
    subtitle: 'Precision Haircuts, Keratin Silk Glaze & Herbal Scalp Detoxification',
    tag: 'Hair Lounge',
    category: 'Luxury Hair Craft',
    location: 'R.S. Puram, Coimbatore',
    rating: 4.92,
    reviewsCount: 186,
    startingPrice: 1200,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=90',
    badge: 'Coimbatore Signature',
    highlights: ['Scalp Dermoscopy', 'Silk Protein Glaze', 'Hibiscus Wash']
  },
  {
    id: 'b-slide-3',
    salonId: 'salon-3',
    title: 'Madurai Mallipoo Flower Braiding & Jada Alankaram',
    subtitle: 'Fragrant Fresh Jasmine Floral Weaving & Royal Antique Gold Accents',
    tag: 'Traditional Rituals',
    category: 'Bridal Floral Art',
    location: 'KK Nagar, Madurai',
    rating: 4.96,
    reviewsCount: 215,
    startingPrice: 1800,
    durationMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1600&q=90',
    badge: 'Madurai Heritage',
    highlights: ['Fresh Fragrant Jasmine', 'Antique Hair Jewels', 'Bridal Braid']
  },
  {
    id: 'b-slide-4',
    salonId: 'salon-4',
    title: 'Kasturi Manjal & Chandanam Golden Glow Facial',
    subtitle: 'Pure Wild Turmeric, Sandalwood & Kumkumadi Radiance Oil Therapy',
    tag: 'Ayurvedic Wellness',
    category: 'Skin Spa Glow',
    location: 'Thillai Nagar, Trichy',
    rating: 4.94,
    reviewsCount: 172,
    startingPrice: 2200,
    durationMinutes: 75,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=90',
    badge: '100% Organic',
    highlights: ['Wild Turmeric Detox', 'Kumkumadi Oil Massage', 'Zero Chemicals']
  },
  {
    id: 'b-slide-5',
    salonId: 'salon-2',
    title: 'Royal Gentlemen’s Grooming & Pattu Veshti Styling',
    subtitle: 'Sandalwood Hot Towel Shave, Precision Beard Crafting & Silk Veshti Draping',
    tag: 'Men’s Grooming',
    category: 'Executive Craft',
    location: 'Anna Nagar, Chennai',
    rating: 4.91,
    reviewsCount: 140,
    startingPrice: 950,
    durationMinutes: 45,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=90',
    badge: 'Gentlemen’s Choice',
    highlights: ['Hot Sandalwood Shave', 'Beard Lineup', 'Silk Veshti Styling']
  },
  {
    id: 'b-slide-6',
    salonId: 'salon-1',
    title: 'Couture Balayage & Silk Protein Hair Transformation',
    subtitle: 'Custom Color Harmony, Gloss Treatment & Anti-Frizz Silk Infusion',
    tag: 'Color Atelier',
    category: 'Hair Transformation',
    location: 'Nungambakkam, Chennai',
    rating: 4.95,
    reviewsCount: 164,
    startingPrice: 3800,
    durationMinutes: 120,
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1600&q=90',
    badge: 'Master Colorist',
    highlights: ['Ammonia-Free Balayage', 'Silk Gloss Shield', 'Bespoke Toning']
  },
  {
    id: 'b-slide-7',
    salonId: 'salon-21',
    title: 'Meenakshi Temple Jasmine & Bridal Alankaram Lounge',
    subtitle: 'Traditional Temple Jewelry Setting, Authentic Malli Braiding & Silk Muhurtham Makeup',
    tag: 'Temple Heritage',
    category: 'Muhurtham Alankaram',
    location: 'South Chithirai St, Madurai',
    rating: 4.98,
    reviewsCount: 194,
    startingPrice: 6800,
    durationMinutes: 150,
    imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1600&q=90',
    badge: 'Temple Artisan',
    highlights: ['Temple Gold Jewels', 'Madurai Malli Braid', 'Madisar Silk Draping']
  }
];

export const Hero3DSlider: React.FC = () => {
  const { navigateToSalon, setCurrentView } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = BEAUTY_SLIDES.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleSlideSelect = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Smooth auto rotation
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, handleNext]);

  // Handle 3D Mouse Tilt on current card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Touch Swipe Handlers for mobile & trackpads
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      id="hero-3d-slider-container"
      className="w-full relative overflow-hidden select-none py-4"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Ambient Background Golden Spotlight */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60 overflow-hidden">
        <div className="w-[850px] h-[450px] bg-gradient-to-tr from-amber-500/20 via-rose-500/10 to-amber-300/25 blur-3xl rounded-full transform -rotate-3 transition-all duration-700" />
      </div>

      {/* 3D STAGE */}
      <div
        className="relative w-full h-[420px] sm:h-[460px] lg:h-[490px] flex items-center justify-center"
        style={{
          perspective: '1500px',
          perspectiveOrigin: '50% 48%'
        }}
      >
        {/* Ambient Stage Reflection Floor */}
        <div className="absolute bottom-2 w-3/4 max-w-2xl h-10 bg-neutral-950/80 blur-2xl rounded-full pointer-events-none" />

        {/* LEFT SCROLLER BUTTON */}
        <button
          id="hero-left-scroller-btn"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 sm:left-4 lg:left-8 z-40 p-3 sm:p-3.5 rounded-full bg-neutral-950/85 hover:bg-amber-500 text-white hover:text-neutral-950 border border-white/20 hover:border-amber-400 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group"
          aria-label="Previous salon photo"
          title="Previous Photo"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* RIGHT SCROLLER BUTTON */}
        <button
          id="hero-right-scroller-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 sm:right-4 lg:right-8 z-40 p-3 sm:p-3.5 rounded-full bg-neutral-950/85 hover:bg-amber-500 text-white hover:text-neutral-950 border border-white/20 hover:border-amber-400 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group"
          aria-label="Next salon photo"
          title="Next Photo"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {BEAUTY_SLIDES.map((slide, index) => {
          let offset = index - currentIndex;
          if (offset < -Math.floor(totalSlides / 2)) {
            offset += totalSlides;
          } else if (offset > Math.floor(totalSlides / 2)) {
            offset -= totalSlides;
          }

          const isCenter = offset === 0;

          let translateX = 0;
          let translateZ = 0;
          let rotateY = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 10;
          let blurAmount = 0;

          if (isCenter) {
            translateX = 0;
            translateZ = 90;
            rotateY = mouseTilt.x * 0.7;
            scale = 1;
            opacity = 1;
            zIndex = 30;
            blurAmount = 0;
          } else if (offset === -1) {
            translateX = -320;
            translateZ = -140;
            rotateY = 32;
            scale = 0.84;
            opacity = 0.72;
            zIndex = 20;
            blurAmount = 1;
          } else if (offset === 1) {
            translateX = 320;
            translateZ = -140;
            rotateY = -32;
            scale = 0.84;
            opacity = 0.72;
            zIndex = 20;
            blurAmount = 1;
          } else if (offset === -2) {
            translateX = -540;
            translateZ = -300;
            rotateY = 46;
            scale = 0.68;
            opacity = 0.35;
            zIndex = 10;
            blurAmount = 3;
          } else if (offset === 2) {
            translateX = 540;
            translateZ = -300;
            rotateY = -46;
            scale = 0.68;
            opacity = 0.35;
            zIndex = 10;
            blurAmount = 3;
          } else {
            opacity = 0;
            zIndex = 0;
            scale = 0.45;
            translateZ = -500;
          }

          return (
            <motion.div
              key={slide.id}
              onClick={() => {
                if (!isCenter) handleSlideSelect(index);
              }}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY: rotateY,
                rotateX: isCenter ? mouseTilt.y * 0.7 : 0,
                scale: scale,
                opacity: opacity,
                filter: `blur(${blurAmount}px)`
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 26,
                mass: 0.75
              }}
              style={{
                transformStyle: 'preserve-3d',
                zIndex: zIndex
              }}
              className={`absolute w-[320px] sm:w-[410px] lg:w-[470px] h-[390px] sm:h-[430px] lg:h-[465px] rounded-xl overflow-hidden bg-neutral-950 border transition-all duration-300 ${
                isCenter
                  ? 'border-amber-400/90 ring-4 ring-amber-400/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-default'
                  : 'border-neutral-800/80 hover:border-amber-500/50 cursor-pointer shadow-xl'
              }`}
            >
              {/* FULL-BLEED BEAUTY IMAGE WITH ATMOSPHERIC OVERLAYS */}
              <div className="relative w-full h-full overflow-hidden group">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isCenter ? 'scale-102 filter contrast-105' : 'filter brightness-90'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Specular Ambient Glow Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

                {/* Rich Atmospheric Vignette & Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-black/30" />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-neutral-950/85 text-white font-mono text-[10px] font-semibold uppercase tracking-wider rounded-xs border border-white/20 backdrop-blur-md shadow-sm">
                      {slide.tag}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold rounded-xs backdrop-blur-md shadow-sm">
                      {slide.badge}
                    </span>
                  </div>

                  <div className="bg-neutral-950/85 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xs text-xs font-mono font-semibold flex items-center gap-1 text-amber-400 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{slide.rating}</span>
                    <span className="text-neutral-400 text-[10px]">({slide.reviewsCount})</span>
                  </div>
                </div>

                {/* Content Overlay Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white flex flex-col justify-end z-10">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{slide.category}</span>
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="flex items-center gap-1 text-neutral-300">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {slide.location}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
                      <Clock className="w-3 h-3" />
                      {slide.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg lg:text-xl font-medium tracking-tight text-white leading-snug drop-shadow-sm line-clamp-1 mb-1">
                    {slide.title}
                  </h3>

                  <p className="text-xs text-neutral-300 line-clamp-1 mb-3 drop-shadow-xs font-normal">
                    {slide.subtitle}
                  </p>

                  {/* Highlights Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {slide.highlights.map((hl, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white/10 text-neutral-200 font-mono text-[10px] rounded-xs border border-white/15 backdrop-blur-xs"
                      >
                        {hl}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 pt-2.5 border-t border-white/15">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToSalon(slide.salonId);
                      }}
                      className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 cursor-pointer active:scale-98"
                    >
                      <span>Book Slot (₹{slide.startingPrice})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToSalon(slide.salonId);
                      }}
                      className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-sm border border-white/20 backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      Studio Info
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Professional Slider Navigation Bar & Autoplay Controls */}
      <div className="flex items-center justify-between max-w-xl mx-auto mt-4 px-4 pt-1">
        {/* Current Slide Counter */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
          <span className="text-amber-400 font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span>/</span>
          <span>{String(totalSlides).padStart(2, '0')}</span>
          <span className="hidden sm:inline text-neutral-500 text-[10px] ml-1">· Signature Studios</span>
        </div>

        {/* Minimalist Interactive Pagination Pills */}
        <div className="flex items-center gap-1.5">
          {BEAUTY_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => handleSlideSelect(idx)}
              className={`transition-all rounded-full h-1.5 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-amber-500 shadow-xs'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              title={slide.title}
            />
          ))}
        </div>

        {/* Autoplay Toggle Button */}
        <button
          onClick={() => setIsAutoPlaying((prev) => !prev)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xs bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-[10px] font-mono transition-colors cursor-pointer"
          title={isAutoPlaying ? 'Pause 3D Auto-Rotation' : 'Resume 3D Auto-Rotation'}
        >
          {isAutoPlaying ? (
            <>
              <Pause className="w-2.5 h-2.5 text-amber-400" />
              <span>Auto</span>
            </>
          ) : (
            <>
              <Play className="w-2.5 h-2.5 text-neutral-400" />
              <span>Paused</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

