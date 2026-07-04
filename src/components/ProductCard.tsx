import React, { useState } from 'react';
import { Star, ShieldAlert, ShoppingCart, Check, Beaker, Edit3 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onEditProduct?: (product: Product, e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onProductClick, onAddToCart, onBuyNow, onEditProduct }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering product detail view click
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <div 
      onClick={() => onProductClick(product)}
      className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/4] bg-slate-50 overflow-hidden border-b border-slate-100">
        
        {/* Zooming Image with Fallback */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quick Edit button for Admin */}
        {onEditProduct && (
          <button
            onClick={(e) => onEditProduct(product, e)}
            className="absolute bottom-3 right-3 z-20 flex items-center justify-center bg-slate-900/90 hover:bg-emerald-600 border border-slate-700 hover:border-transparent text-white rounded-lg p-2 font-mono text-[9px] tracking-tight shadow-md transition-all scale-100 active:scale-95"
            title="Edit Product Specs"
            id={`storefront-edit-btn-${product.id}`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Hover glass overlay for quick inspect */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-center">
          <div className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-semibold tracking-widest uppercase py-2.5 px-4 rounded-md shadow-lg border border-slate-200/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Formulation Specs
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] sm:text-[10px] font-mono tracking-widest text-slate-400 uppercase font-medium">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400" />
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-slate-700">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xs sm:text-base font-semibold text-slate-900 group-hover:text-slate-800 leading-snug mb-1 sm:mb-2 flex-grow line-clamp-1">
          {product.name}
        </h3>

        {/* Short Spec summary */}
        <p className="text-[11px] sm:text-xs text-slate-500 font-light line-clamp-2 leading-relaxed mb-2.5 sm:mb-4">
          {product.shortDescription}
        </p>

        {/* Active Molecular Ingredient */}
        <div className="bg-slate-50 border border-slate-100 rounded p-1.5 sm:px-2.5 sm:py-1.5 mb-2.5 sm:mb-4 flex items-center gap-1 sm:gap-1.5">
          <Beaker className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
          <span className="font-mono text-[8px] sm:text-[9px] text-slate-500 truncate leading-none">
            Active: <span className="font-medium text-slate-700">{product.keyActive}</span>
          </span>
        </div>

        {/* Pricing & Add Button */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 gap-1.5">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xs sm:text-base font-semibold text-slate-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-[9px] sm:text-xs text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`p-1.5 sm:p-2 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                product.stock === 0
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Add to formulation cart"
              id={`add-to-cart-btn-${product.id}`}
            >
              {isAdded ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
              ) : (
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>

            {onBuyNow && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow(product);
                }}
                disabled={product.stock === 0}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-[8px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center justify-center transition-all duration-300 border ${
                  product.stock === 0
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs'
                }`}
                id={`buy-now-btn-${product.id}`}
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
