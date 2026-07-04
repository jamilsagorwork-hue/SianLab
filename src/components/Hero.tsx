import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Microscope, Database, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  products: Product[];
  onExploreClick: () => void;
  onProductClick: (product: Product) => void;
}

export default function Hero({ products, onExploreClick, onProductClick }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!products || products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Safe indexes to determine cell hydration index / metrics dynamically based on rating and reviews
  const hydrationIndex = Math.round(90 + (currentProduct.rating * 2));
  const elasticityIndex = Math.round(75 + (currentProduct.reviewsCount % 20));

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[520px] md:min-h-[580px] flex items-center py-12 px-4 md:px-8">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 dark-grid-bg opacity-35 pointer-events-none"></div>

      {/* Decorative Blur Spheres (Glass Glow) */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Subtle Laser Accent Line */}
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Column: Premium Marketing Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-slate-300 font-semibold uppercase">
              Clinical Breakthrough • China Import
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-slate-50">
            Advanced Clinical <br />
            <span className="italic font-normal text-emerald-400">Bio-Formulations</span> <br />
            for Glass Skin.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed font-light">
            SianLab brings you premium, scientific skincare imported directly from Shanghai’s elite biotechnology labs. By fusing cell-activating GHK-Cu Copper Peptides with imperial botanicals, we rebuild skin density and luminosity at a cellular level.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-emerald-600 text-white font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-emerald-700 hover:scale-[1.02] shadow-lg shadow-emerald-500/15"
              id="hero-cta"
            >
              Explore the Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            
            <a
              href="#philosophy"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('philosophy-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/80 hover:border-slate-600 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            >
              Scientific Philosophy
            </a>
          </div>

          {/* Quick trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md">
            <div className="space-y-1.5">
              <span className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase">Purity</span>
              <span className="block text-xs font-semibold text-slate-200">100% Certified</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase">Potency</span>
              <span className="block text-xs font-semibold text-slate-200">Clinical-Grade</span>
            </div>
            <div className="space-y-1.5">
              <span className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase">Imported</span>
              <span className="block text-xs font-semibold text-slate-200">Direct Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Interactive Product Picture Slideshow ("one after another") */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Main Slide Carousel Container */}
          <div 
            onClick={() => onProductClick(currentProduct)}
            className="relative w-full max-w-[360px] aspect-[4/5] rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800/50 shadow-2xl group cursor-pointer hover:border-emerald-500/40 transition-colors duration-300"
            id="hero-slideshow"
          >
            {/* Ambient Image Background of Premium Product */}
            <div className="absolute inset-0 bg-slate-950">
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name} 
                className="w-full h-full object-cover opacity-70 scale-100 group-hover:scale-[1.03] transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Absolute Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent"></div>

            {/* Glowing Laboratory Scan line */}
            <div className="absolute inset-x-0 h-[2px] bg-emerald-500/60 shadow-[0_0_15px_#10b981] animate-bounce" style={{ animationDuration: '6s' }}></div>

            {/* Laboratory Technical HUD overlay */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-emerald-400/80 bg-slate-950/75 backdrop-blur-md border border-emerald-500/30 rounded-md px-2 py-1 flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5" />
              <span className="tracking-wider">LAB DISCOVERY ROTATOR: ACTIVE</span>
            </div>

            {/* Premium Category Badge */}
            <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-300 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-md px-2.5 py-1">
              <span>{currentIndex + 1} / {products.length}</span>
            </div>

            {/* Prev/Next Navigation Controls */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button 
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-transparent flex items-center justify-center backdrop-blur-xs transition-all pointer-events-auto"
                title="Previous Formulation"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button 
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-transparent flex items-center justify-center backdrop-blur-xs transition-all pointer-events-auto"
                title="Next Formulation"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom floating product callout */}
            <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl dark-glass-panel space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-bold">
                  {currentProduct.category}
                </span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                  ${currentProduct.price}.00
                </span>
              </div>
              
              <h3 className="font-serif text-base font-bold text-white leading-snug tracking-tight group-hover:text-emerald-300 transition-colors">
                {currentProduct.name}
              </h3>

              <p className="text-[11px] text-slate-300 leading-relaxed font-light line-clamp-2">
                {currentProduct.shortDescription}
              </p>
              
              {/* Dynamic Clinical progress bars */}
              <div className="space-y-1.5 pt-1.5 text-[9px] font-mono border-t border-slate-800/60">
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>CELL HYDRATION INDEX</span>
                    <span className="text-emerald-400 font-bold">+{hydrationIndex}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${hydrationIndex - 30}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>DERMAL RETENTION DENSITY</span>
                    <span className="text-emerald-400 font-bold">+{elasticityIndex}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${elasticityIndex - 15}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Indicators beneath frame */}
          <div className="flex items-center gap-1.5 mt-3.5">
            {products.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Formulation ${idx + 1}`}
              ></button>
            ))}
          </div>

          {/* Ambient tags */}
          <div className="absolute -right-4 top-12 p-2.5 rounded-lg border border-slate-700/60 dark-glass-panel flex flex-col items-center justify-center gap-0.5 shadow-xl pointer-events-none select-none">
            <span className="font-mono text-[8px] text-slate-400 uppercase tracking-wider">LAB RATING</span>
            <span className="text-xs font-bold text-emerald-400 font-display flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-current text-emerald-400" />
              {currentProduct.rating.toFixed(1)}
            </span>
          </div>

          <div className="absolute -left-4 bottom-16 p-2.5 rounded-lg border border-slate-700/60 dark-glass-panel flex items-center gap-2 shadow-xl pointer-events-none select-none">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[7px] text-slate-400 uppercase tracking-wider">Batch State</span>
              <span className="text-[9px] font-semibold text-white">
                {currentProduct.stock > 0 ? `${currentProduct.stock} Units Left` : 'RESTOCKING'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
