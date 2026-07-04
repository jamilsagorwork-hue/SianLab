import React, { useState } from 'react';
import { ArrowLeft, Star, ShieldCheck, Beaker, Check, ShoppingBag, Award, HelpCircle, Edit3 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  onEditProduct?: (product: Product) => void;
}

export default function ProductDetail({ product, onBack, onAddToCart, onBuyNow, onEditProduct }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'how-to'>('details');

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Structured Mock Reviews matching clinical research aesthetic
  const mockReviews = [
    {
      author: 'Dr. Evelyn Chen',
      role: 'Clinical Dermatologist (Shanghai Allied Health)',
      rating: 5,
      date: '2026-05-18',
      title: 'Remarkable peptide stability',
      comment: 'I am highly impressed with the chemical stability of SianLab’s blue copper peptides. Patients reported visible improvements in epidermal density and a reduction in post-treatment redness in as little as 10 days.'
    },
    {
      author: 'Julian K.',
      role: 'Verified Skincare Aficionado',
      rating: 5,
      date: '2026-06-02',
      title: 'True Glass Skin in a bottle',
      comment: 'This product has completely transformed my texture. It absorbs instantly without leaving any sticky residue. My skin feels bouncy, radiant, and incredibly calm. Best skin investment.'
    },
    {
      author: 'Prof. Hans-Werner S.',
      role: 'Cosmetic Formulation Advisor',
      rating: 4,
      date: '2026-04-12',
      title: 'Superb vehicle delivery system',
      comment: 'The molecular weight distribution of the crosslinked sodium hyaluronate in this formula allows for gradual release of the peptides, avoiding the typical sensitization observed in other high-potency serums.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="product-detail-view">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Navigation Bar & Quick Edit for Admin */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-slate-500 hover:text-slate-900 transition-colors uppercase"
            id="detail-back-button"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Collection
          </button>

          {onEditProduct && (
            <button
              onClick={() => onEditProduct(product)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              id="detail-edit-button"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Formulation Specs</span>
            </button>
          )}
        </div>

        {/* Product Spec Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Column Left: Visual Assets Frame (Gallery) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/4] rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Micro Gallery Detail Placeholders */}
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 bg-white group cursor-pointer">
                <img 
                  src={product.image} 
                  alt="Detail close-up" 
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 bg-slate-900 flex flex-col items-center justify-center p-2 text-center text-[8px] text-slate-400 font-mono">
                <Beaker className="w-4 h-4 text-emerald-500 mb-1" />
                <span>FORMULATION STABILITY</span>
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 bg-slate-100 flex flex-col items-center justify-center p-2 text-center text-[8px] text-slate-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span>99.8% BIO-PURE</span>
              </div>
            </div>

            {/* Certification / Purity Trust Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-semibold text-slate-900">Certified Imported Authenticity</h4>
                <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-relaxed">
                  Every SianLab product arrives in serialized clean-room sealing, verifying double laboratory testing in Shanghai and Berlin.
                </p>
              </div>
            </div>
          </div>

          {/* Column Right: Formulation Specification */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header, title, badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-slate-900 text-white font-mono text-[9px] font-semibold tracking-wider uppercase">
                  {product.category}
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono text-[9px] font-semibold tracking-wider uppercase">
                  Lab Certified
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating metrics */}
              <div className="flex items-center gap-3.5 py-1">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-900">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">
                  Based on <strong className="font-semibold text-slate-800">{product.reviewsCount}</strong> clinical peer reviews & purchases
                </span>
              </div>
            </div>

            {/* Pricing Panel */}
            <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs flex items-baseline justify-between">
              <div className="space-y-1">
                <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">Current Valuation</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-slate-900">${product.price}.00</span>
                  {product.originalPrice && (
                    <span className="font-mono text-sm text-slate-400 line-through">${product.originalPrice}.00</span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono ml-2">USD (Duties & Imports included)</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">Availability</span>
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Tabbed Spec Specifications */}
            <div className="border-b border-slate-200">
              <div className="flex gap-4">
                {(['details', 'ingredients', 'how-to'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all ${
                      activeTab === tab
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'details' ? 'Formulation Profile' : tab === 'ingredients' ? 'Molecular Ingredients' : 'Usage Protocol'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[160px] py-2">
              {activeTab === 'details' && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-slate-600 text-sm leading-relaxed font-light">
                    {product.description}
                  </p>
                  
                  {/* Highlight box */}
                  <div className="p-3.5 bg-slate-50 border-l-2 border-emerald-500 rounded-r-lg">
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-slate-700 uppercase">
                      <Beaker className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Primary Active Complex</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {product.keyActive}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-xs text-slate-500 leading-relaxed font-mono">
                    SianLab formulations operate under strict green chemistry principles. The complete sequence of molecular and botanical components is listed below:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.ingredients.map((ing, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 rounded bg-white border border-slate-200/60 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'how-to' && (
                <div className="space-y-3 animate-fadeIn text-slate-600 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <p>{product.usage}</p>
                  </div>
                  <div className="flex items-start gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-xs text-slate-500">
                      <strong>Dermal Tip:</strong> Ensure to seal bottle collars tightly after use. Keep store values between 15°C and 25°C away from direct laboratory UV lamps or solar radiation to prevent micro-denaturing of bioactive enzymes.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Adding configuration (Quantity selector and Add to Cart) */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-slate-200">
                <div className="space-y-1 shrink-0 text-left">
                  <span className="block text-[9px] font-mono tracking-wider text-slate-400 uppercase">Quantity</span>
                  <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-md bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 font-mono text-sm font-medium text-slate-900">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-grow flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-md text-xs font-semibold uppercase tracking-widest transition-all duration-300 border ${
                      isAdded 
                        ? 'bg-slate-900 text-white border-transparent' 
                        : 'bg-white text-slate-850 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        Add To Cart
                      </>
                    )}
                  </button>

                  {onBuyNow && (
                    <button
                      onClick={() => onBuyNow(product, quantity)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-md text-xs font-semibold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 shadow-sm hover:scale-[1.01]"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Micro FAQ line */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Free global carbon-neutral air cargo on all shipments over $150.</span>
            </div>

          </div>
        </div>

        {/* Peer Reviews section */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="space-y-1 mb-8 text-left">
            <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
              Authentic Feedback
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Formulation Performance Logs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockReviews.map((rev, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white border border-slate-100 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[9px] text-slate-400">{rev.date}</span>
                  </div>
                  
                  <h4 className="text-xs font-semibold text-slate-900 text-left">"{rev.title}"</h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed text-left">
                    {rev.comment}
                  </p>
                </div>

                <div className="border-t border-slate-50 mt-4 pt-3 text-left">
                  <span className="block text-xs font-semibold text-slate-800">{rev.author}</span>
                  <span className="block text-[9px] font-mono text-slate-400 mt-0.5">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
