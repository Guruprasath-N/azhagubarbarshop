import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  Star,
  ArrowUpDown,
  Scissors,
  CheckCircle2,
  X,
  Sparkles,
  LayoutGrid,
  List,
  Compass,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  Filter
} from 'lucide-react';

export const DiscoverSalons: React.FC = () => {
  const { salons, categories, services, navigateToSalon } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<'ALL' | 'BUDGET' | 'PREMIUM'>('ALL');
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'RATING' | 'REVIEWS' | 'PRICE_ASC' | 'PRICE_DESC'>('RECOMMENDED');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST' | 'MAP'>('GRID');
  const [selectedMapSalonId, setSelectedMapSalonId] = useState<string | null>(null);

  // Distinct city list
  const cities = useMemo(() => {
    const counts: Record<string, number> = {};
    salons.forEach((s) => {
      if (s.status === 'ACTIVE' && s.city) {
        counts[s.city] = (counts[s.city] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [salons]);

  // Filtered & Sorted Salons
  const filteredSalons = useMemo(() => {
    return salons
      .filter((s) => {
        // Active salons only for public discovery
        if (s.status !== 'ACTIVE') return false;

        // Search query across name, description, address, city, and services
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchCity = s.city.toLowerCase().includes(q);
          const matchDesc = s.description.toLowerCase().includes(q);
          const matchAddress = s.address.toLowerCase().includes(q);
          const salonServices = services.filter((srv) => srv.salon_id === s.id);
          const matchService = salonServices.some((srv) => srv.name.toLowerCase().includes(q));

          if (!matchName && !matchCity && !matchDesc && !matchAddress && !matchService) {
            return false;
          }
        }

        // City filter
        if (selectedCity !== 'ALL' && s.city !== selectedCity) {
          return false;
        }

        // Category filter
        if (selectedCategoryId !== 'ALL') {
          if (!s.category_ids.includes(selectedCategoryId)) {
            return false;
          }
        }

        // Minimum Rating
        if (minRating > 0 && s.rating < minRating) {
          return false;
        }

        // Price range filter
        if (priceRange !== 'ALL') {
          const salonServices = services.filter((srv) => srv.salon_id === s.id);
          const minPrice = salonServices.length ? Math.min(...salonServices.map((x) => x.price)) : 800;
          if (priceRange === 'BUDGET' && minPrice > 1500) return false;
          if (priceRange === 'PREMIUM' && minPrice < 2500) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'RATING') return b.rating - a.rating;
        if (sortBy === 'REVIEWS') return b.review_count - a.review_count;

        const aServices = services.filter((s) => s.salon_id === a.id);
        const bServices = services.filter((s) => s.salon_id === b.id);
        const aMinPrice = aServices.length ? Math.min(...aServices.map((s) => s.price)) : 800;
        const bMinPrice = bServices.length ? Math.min(...bServices.map((s) => s.price)) : 800;

        if (sortBy === 'PRICE_ASC') return aMinPrice - bMinPrice;
        if (sortBy === 'PRICE_DESC') return bMinPrice - aMinPrice;

        return 0; // Default Recommended
      });
  }, [salons, services, searchQuery, selectedCity, selectedCategoryId, minRating, priceRange, sortBy]);

  const totalActiveSalons = salons.filter((s) => s.status === 'ACTIVE').length;

  const activeMapSalon = useMemo(() => {
    if (!selectedMapSalonId) return filteredSalons[0] || null;
    return filteredSalons.find((s) => s.id === selectedMapSalonId) || filteredSalons[0] || null;
  }, [filteredSalons, selectedMapSalonId]);

  return (
    <div id="discover-salons-root" className="bg-neutral-50 min-h-screen text-neutral-900 font-sans pb-16">
      {/* 1. DEDICATED DIRECTORY & DISCOVERY BANNER (Clean, focused, strictly differentiated from Home) */}
      <section className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white border-b border-neutral-800 pt-8 pb-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-400/30 rounded-xs text-[11px] font-mono text-amber-300 mb-2.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Studio Directory & Slot Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white">
                Explore Verified Salons Across Tamil Nadu
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl font-normal">
                Filter through {totalActiveSalons} authentic studios in Chennai, Coimbatore, Madurai, Trichy, and Salem. Compare real-time slot availability, verified ratings, and transparent prices.
              </p>
            </div>

            {/* Quick Live Stats Pills */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-mono">
              <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{totalActiveSalons} Verified Studios</span>
              </div>
              <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm flex items-center gap-1.5 text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Slots Today</span>
              </div>
            </div>
          </div>

          {/* Quick City Filter Navigation Strip */}
          <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex-none mr-1">
              Location Hubs:
            </span>
            <button
              onClick={() => setSelectedCity('ALL')}
              className={`px-3 py-1.5 rounded-sm flex-none transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                selectedCity === 'ALL'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>All Tamil Nadu</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCity === 'ALL' ? 'bg-neutral-950/20 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-400'
              }`}>
                {totalActiveSalons}
              </span>
            </button>

            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city.name)}
                className={`px-3 py-1.5 rounded-sm flex-none transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCity === city.name
                    ? 'bg-amber-500 text-neutral-950 font-semibold shadow-xs'
                    : 'bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>{city.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCity === city.name ? 'bg-neutral-950/20 text-neutral-950 font-bold' : 'bg-white/10 text-neutral-400'
                }`}>
                  {city.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ADVANCED SEARCH & CONTROL DECK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-6 space-y-6">
        <div className="bg-white border border-neutral-200 rounded-md p-4 sm:p-5 shadow-xs space-y-4">
          {/* Top Row: Search Input + Sort + View Mode Switcher */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-discover-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search studio name, Muhurtham bridal, haircut, facial, Madisar, locality..."
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-neutral-950 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Options Dropdown */}
            <div className="md:col-span-3">
              <div className="relative">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="select-discover-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-8 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-sm focus:outline-none focus:border-neutral-950 focus:bg-white cursor-pointer"
                >
                  <option value="RECOMMENDED">Sort: Recommended</option>
                  <option value="RATING">Sort: Highest Rated (★)</option>
                  <option value="REVIEWS">Sort: Most Reviews</option>
                  <option value="PRICE_ASC">Sort: Price (Low to High)</option>
                  <option value="PRICE_DESC">Sort: Price (High to Low)</option>
                </select>
              </div>
            </div>

            {/* View Mode Switcher (Grid vs List vs Map) */}
            <div className="md:col-span-3 flex items-center justify-end gap-1 border-t md:border-t-0 pt-2 md:pt-0 border-neutral-100">
              <span className="text-[11px] font-mono text-neutral-400 mr-1 hidden sm:inline">View:</span>
              <div className="inline-flex rounded-sm border border-neutral-200 p-0.5 bg-neutral-50">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`p-1.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                    viewMode === 'GRID'
                      ? 'bg-neutral-950 text-white font-medium shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                  title="Grid Layout"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`p-1.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                    viewMode === 'LIST'
                      ? 'bg-neutral-950 text-white font-medium shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                  title="Detailed List Layout"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="text-[11px]">List</span>
                </button>
                <button
                  onClick={() => setViewMode('MAP')}
                  className={`p-1.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                    viewMode === 'MAP'
                      ? 'bg-neutral-950 text-white font-medium shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                  title="Tamil Nadu Map Radar"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px]">Radar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex-none">
              Discipline:
            </span>
            <button
              onClick={() => setSelectedCategoryId('ALL')}
              className={`px-3 py-1.5 rounded-sm flex-none transition-all cursor-pointer font-medium ${
                selectedCategoryId === 'ALL'
                  ? 'bg-neutral-950 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-sm flex-none transition-all cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? 'bg-neutral-950 text-white font-medium shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Refinement Pills (Rating + Price Range + Reset) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Rating filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Rating:</span>
                {[
                  { val: 0, label: 'All' },
                  { val: 4.8, label: '★ 4.8+' },
                  { val: 4.9, label: '★ 4.9+' }
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => setMinRating(r.val)}
                    className={`px-2.5 py-1 rounded-xs text-[11px] font-mono transition-colors cursor-pointer ${
                      minRating === r.val
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                        : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Price range filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Budget:</span>
                {[
                  { val: 'ALL', label: 'All Budgets' },
                  { val: 'BUDGET', label: 'Under ₹1,500' },
                  { val: 'PREMIUM', label: 'Luxury (₹2,500+)' }
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPriceRange(p.val as any)}
                    className={`px-2.5 py-1 rounded-xs text-[11px] font-mono transition-colors cursor-pointer ${
                      priceRange === p.val
                        ? 'bg-neutral-900 text-white font-medium'
                        : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results counter & Reset */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-500">
                Showing <strong className="text-neutral-950">{filteredSalons.length}</strong> of {totalActiveSalons} studios
              </span>
              {(searchQuery || selectedCity !== 'ALL' || selectedCategoryId !== 'ALL' || minRating > 0 || priceRange !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('ALL');
                    setSelectedCategoryId('ALL');
                    setMinRating(0);
                    setPriceRange('ALL');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium underline cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. VIEW MODES */}

        {/* EMPTY STATE */}
        {filteredSalons.length === 0 && (
          <div className="p-12 text-center bg-white border border-neutral-200 rounded-md shadow-xs">
            <Scissors className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-900 mb-1">No Salons Found For This Criteria</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-5">
              Try removing some filters, broadening your search keyword, or selecting &quot;All Tamil Nadu&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('ALL');
                setSelectedCategoryId('ALL');
                setMinRating(0);
                setPriceRange('ALL');
              }}
              className="px-5 py-2.5 bg-neutral-950 text-white text-xs font-medium rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* VIEW MODE: MAP / RADAR INTERACTIVE VIEW */}
        {filteredSalons.length > 0 && viewMode === 'MAP' && (
          <div className="bg-white border border-neutral-200 rounded-md p-5 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Interactive Radar Visual Canvas */}
              <div className="lg:col-span-7 bg-neutral-950 rounded-md p-6 text-white relative overflow-hidden border border-neutral-800 min-h-[440px] flex flex-col justify-between">
                {/* Visual Radar Grid Background */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-neutral-300">Tamil Nadu Studio Radar View</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400">Click a City Node</span>
                </div>

                {/* City Nodes Layout */}
                <div className="relative z-10 py-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {cities.map((city) => {
                    const isSelected = selectedCity === city.name;
                    return (
                      <button
                        key={city.name}
                        onClick={() => setSelectedCity(city.name)}
                        className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{city.name}</span>
                          <span className="px-1.5 py-0.5 bg-white/15 rounded-xs text-[10px] font-mono font-bold">
                            {city.count}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {city.name === 'Chennai' && 'Anna Nagar, T. Nagar, Alwarpet'}
                          {city.name === 'Coimbatore' && 'R.S. Puram, Race Course'}
                          {city.name === 'Madurai' && 'Temple Gate, KK Nagar'}
                          {city.name === 'Trichy' && 'Thillai Nagar, Cantonment'}
                          {city.name === 'Salem' && 'Fairlands, Meyyanur'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Radar Footer */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                  <span>Selected Hub: <strong className="text-white">{selectedCity}</strong></span>
                  <span>{filteredSalons.length} Studios Located</span>
                </div>
              </div>

              {/* Studios List in Radar Selection */}
              <div className="lg:col-span-5 space-y-3 max-h-[460px] overflow-y-auto pr-1">
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider pb-1">
                  Active Studios in this Region ({filteredSalons.length})
                </div>
                {filteredSalons.map((salon) => {
                  const isHighlighted = activeMapSalon?.id === salon.id;
                  const salonServices = services.filter((s) => s.salon_id === salon.id && s.is_active);
                  const minPrice = salonServices.length ? Math.min(...salonServices.map((s) => s.price)) : 800;

                  return (
                    <div
                      key={salon.id}
                      onClick={() => setSelectedMapSalonId(salon.id)}
                      className={`p-3.5 rounded-sm border transition-all cursor-pointer flex gap-3 ${
                        isHighlighted
                          ? 'bg-amber-50/50 border-amber-400 shadow-sm'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <img
                        src={salon.cover_image_url}
                        alt={salon.name}
                        className="w-16 h-16 rounded-xs object-cover flex-none"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-semibold text-neutral-950 truncate">{salon.name}</h4>
                            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-xs flex items-center gap-0.5 flex-none">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              {salon.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-neutral-400 flex-none" />
                            {salon.address}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="font-mono text-[11px] text-neutral-600">From ₹{minPrice}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToSalon(salon.id);
                            }}
                            className="px-2.5 py-1 bg-neutral-950 text-white text-[11px] font-medium rounded-xs hover:bg-neutral-800 transition-colors"
                          >
                            Book Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE: DETAILED HORIZONTAL LIST */}
        {filteredSalons.length > 0 && viewMode === 'LIST' && (
          <div className="space-y-4">
            {filteredSalons.map((salon) => {
              const salonServices = services.filter((srv) => srv.salon_id === salon.id && srv.is_active);
              const minPrice = salonServices.length ? Math.min(...salonServices.map((s) => s.price)) : 800;

              return (
                <div
                  key={salon.id}
                  id={`card-salon-list-${salon.id}`}
                  className="bg-white border border-neutral-200 rounded-md p-4 sm:p-5 hover:border-neutral-400 transition-all shadow-2xs flex flex-col md:flex-row gap-5 items-start justify-between group"
                >
                  {/* Image thumbnail with photo indicator */}
                  <div className="w-full md:w-56 h-40 rounded-sm overflow-hidden relative flex-none bg-neutral-100">
                    <img
                      src={salon.cover_image_url}
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-neutral-900/90 text-white px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider">
                      {salon.city}
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-xs text-[11px] font-mono font-bold flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{salon.rating}</span>
                      <span className="text-neutral-400 text-[10px]">({salon.review_count})</span>
                    </div>
                  </div>

                  {/* Information Details Center */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-neutral-950 group-hover:text-neutral-800 transition-colors">
                        {salon.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium rounded-xs">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Verified Partner
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-none" />
                      <span>{salon.address}, {salon.city}</span>
                    </p>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {salon.description}
                    </p>

                    {/* Popular Services & Phone Details */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Top Services:</span>
                      {salonServices.slice(0, 3).map((srv) => (
                        <span
                          key={srv.id}
                          className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded-xs text-[11px] text-neutral-700 font-mono"
                        >
                          {srv.name} (₹{srv.price})
                        </span>
                      ))}
                    </div>

                    <div className="pt-1 flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Open Today · 9:00 AM – 8:30 PM</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{salon.phone}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="w-full md:w-44 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 flex-none">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Starts From</span>
                      <span className="text-base font-bold text-neutral-950 font-mono">
                        ₹{minPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      id={`btn-book-list-${salon.id}`}
                      onClick={() => navigateToSalon(salon.id)}
                      className="px-5 py-2.5 bg-neutral-950 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Book Slot</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE: VISUAL 3-COLUMN GRID */}
        {filteredSalons.length > 0 && viewMode === 'GRID' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSalons.map((salon) => {
              const salonServices = services.filter((srv) => srv.salon_id === salon.id && srv.is_active);
              const minPrice = salonServices.length
                ? Math.min(...salonServices.map((s) => s.price))
                : 800;

              return (
                <div
                  key={salon.id}
                  id={`card-salon-${salon.id}`}
                  className="bg-white border border-neutral-200 rounded-md overflow-hidden flex flex-col hover:border-neutral-400 hover:shadow-md transition-all group"
                >
                  {/* Cover Header */}
                  <div className="h-52 relative overflow-hidden bg-neutral-100">
                    <img
                      src={salon.cover_image_url}
                      alt={salon.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="bg-neutral-950/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold">
                        {salon.city}
                      </div>
                      <div className="bg-white/95 backdrop-blur-xs px-2 py-1 rounded-xs text-xs font-mono font-medium flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="font-bold text-neutral-900">{salon.rating}</span>
                        <span className="text-neutral-500 text-[10px]">({salon.review_count})</span>
                      </div>
                    </div>

                    {/* Bottom Status Inside Cover */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-[11px] font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="drop-shadow-xs font-medium">Slots Available Today</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-neutral-950 group-hover:text-neutral-800 transition-colors line-clamp-1">
                          {salon.name}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mb-2.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-none" />
                        <span className="truncate">{salon.address}</span>
                      </p>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-3">
                        {salon.description}
                      </p>

                      {/* Popular Services Chips */}
                      {salonServices.length > 0 && (
                        <div className="space-y-1 pt-2.5 border-t border-neutral-100">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                            Popular Offerings:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {salonServices.slice(0, 2).map((srv) => (
                              <span
                                key={srv.id}
                                className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded-xs text-[11px] text-neutral-700 font-mono"
                              >
                                {srv.name} (₹{srv.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Starts From</span>
                        <span className="text-sm font-semibold text-neutral-950 font-mono">
                          ₹{minPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-explore-${salon.id}`}
                          onClick={() => navigateToSalon(salon.id)}
                          className="px-3.5 py-2 bg-neutral-950 text-white text-xs font-semibold rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Book Slot</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

