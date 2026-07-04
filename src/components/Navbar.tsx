import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Beaker, Menu, X, Users, Settings } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartToggle: () => void;
  currentView: 'store' | 'admin';
  onViewChange: (view: 'store' | 'admin') => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  userAuthNode?: React.ReactNode;
}

export default function Navbar({
  cartCount,
  onCartToggle,
  currentView,
  onViewChange,
  selectedCategory,
  onCategorySelect,
  userAuthNode,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['All', 'Serums & Essences', 'Moisturizers & Balms', 'Specialized Treatments'];

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center px-4 md:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            onViewChange('store');
            onCategorySelect('All');
          }} 
          className="flex items-center gap-2.5 cursor-pointer"
          id="nav-logo"
        >
          <h1 className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-slate-800 select-none">
            Sian<span className="font-bold">Lab</span><span className="text-xs align-top ml-0.5 text-emerald-500 font-mono font-bold">.COM</span>
          </h1>
        </div>

        {/* Desktop Navigation Links (Only shown when on storefront) */}
        {currentView === 'store' && (
          <div className="hidden md:flex items-center gap-8 self-stretch h-full" id="nav-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`h-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border-b-2 flex items-center px-1 ${
                  selectedCategory === cat
                    ? 'text-emerald-600 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-800 border-transparent hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3" id="nav-actions">
          {/* Scientific Quality Verification Tag (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-100 bg-slate-50/50 text-[10px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>99.8% PURE BIO-EXTRACTS</span>
          </div>

          {userAuthNode}

          {/* Admin Toggle Mode Switcher */}
          <button
            onClick={() => onViewChange(currentView === 'store' ? 'admin' : 'store')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md border text-xs font-medium tracking-wide transition-all duration-300 ${
              currentView === 'admin'
                ? 'bg-emerald-600 text-white border-transparent font-semibold shadow-sm hover:bg-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
            }`}
            id="admin-mode-toggle"
            title={currentView === 'store' ? 'Enter Admin Control Panel' : 'Return to Customer Storefront'}
          >
            {currentView === 'admin' ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Lab</span>
              </>
            )}
          </button>

          {/* Shopping Cart Trigger */}
          {currentView === 'store' && (
            <button
              onClick={onCartToggle}
              className="relative p-2.5 rounded-lg border border-slate-150 hover:border-slate-250 hover:bg-slate-50 transition-all duration-200 group"
              id="cart-trigger"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700 group-hover:text-slate-900 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile Menu Icon (Only on Storefront) */}
          {currentView === 'store' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-150 transition-colors"
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu (Absolute Dropdown Overlay) */}
      {mobileMenuOpen && currentView === 'store' && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-5 z-50 flex flex-col gap-3 md:hidden">
          <p className="text-[10px] font-mono text-slate-400 px-1 uppercase tracking-widest font-bold">
            Browse Categories
          </p>
          <div className="grid grid-cols-1 gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onCategorySelect(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-2 pt-3.5 flex items-center justify-between px-1 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> CLINICALLY VERIFIED
            </span>
            <span className="font-bold text-slate-400">SHANGHAI LABS</span>
          </div>
        </div>
      )}
    </nav>
  );
}
