import React, { useState, useEffect, useMemo } from 'react';
import { Beaker, ShieldCheck, HelpCircle, ArrowRight, Star, RefreshCw } from 'lucide-react';

import { Product, CartItem, Order, Customer } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_ORDERS } from './data/initialData';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import UserAuth from './components/UserAuth';
import { supabase } from './lib/supabase';

export default function App() {
  // Global States
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Authenticated User State
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  // Database lists (with localStorage syncing)
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [adminEditProduct, setAdminEditProduct] = useState<Product | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('sian_admin_authenticated') === 'true';
  });

  const handleStorefrontEditProduct = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAdminEditProduct(product);
    setCurrentView('admin');
    setSelectedProduct(null); // Clear selected details view if open
  };

  // Initialize data on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('sian_products');
    const storedOrders = localStorage.getItem('sian_orders');
    const storedCustomers = localStorage.getItem('sian_customers');
    const storedCart = localStorage.getItem('sian_cart');

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('sian_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('sian_orders', JSON.stringify(INITIAL_ORDERS));
    }

    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      setCustomers(INITIAL_CUSTOMERS);
      localStorage.setItem('sian_customers', JSON.stringify(INITIAL_CUSTOMERS));
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Try fetching live products and orders from Supabase database if tables exist
    const syncWithSupabaseOnMount = async () => {
      try {
        const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*');
        if (!prodErr && dbProducts && dbProducts.length > 0) {
          const mappedProds: Product[] = dbProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            originalPrice: p.original_price ? Number(p.original_price) : undefined,
            shortDescription: p.short_description || '',
            description: p.description || '',
            ingredients: typeof p.ingredients === 'string' ? JSON.parse(p.ingredients) : p.ingredients || [],
            keyActive: p.key_active || '',
            usage: p.usage || '',
            category: p.category || '',
            image: p.image || '',
            rating: Number(p.rating || 4.5),
            reviewsCount: Number(p.reviews_count || 0),
            stock: Number(p.stock || 0),
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || [],
          }));
          setProducts(mappedProds);
          localStorage.setItem('sian_products', JSON.stringify(mappedProds));
        }

        const { data: dbOrders, error: ordErr } = await supabase.from('orders').select('*');
        if (!ordErr && dbOrders && dbOrders.length > 0) {
          const mappedOrders: Order[] = dbOrders.map(o => ({
            id: o.id,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            total: Number(o.total),
            date: o.date,
            status: o.status,
            paymentMethod: o.payment_method,
            shippingAddress: typeof o.shipping_address === 'string' 
              ? JSON.parse(o.shipping_address) 
              : o.shipping_address,
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
          }));
          setOrders(prevOrders => {
            const combined = [...mappedOrders, ...prevOrders];
            const unique = combined.filter((val, index, self) => 
              self.findIndex(t => t.id === val.id) === index
            );
            localStorage.setItem('sian_orders', JSON.stringify(unique));
            return unique;
          });
        }
      } catch (err) {
        console.warn('Supabase initialization sync bypassed:', err);
      }
    };
    syncWithSupabaseOnMount();
  }, []);

  // Sync state modifications back to localStorage
  const saveProducts = (newProds: Product[]) => {
    setProducts(newProds);
    localStorage.setItem('sian_products', JSON.stringify(newProds));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('sian_orders', JSON.stringify(newOrders));
  };

  const saveCustomers = (newCusts: Customer[]) => {
    setCustomers(newCusts);
    localStorage.setItem('sian_customers', JSON.stringify(newCusts));
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('sian_cart', JSON.stringify(newCart));
  };

  // 1. SHOPPING CART HANDLERS
  const handleAddToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: Math.min(product.stock, updatedCart[existingIndex].quantity + 1),
      };
    } else {
      updatedCart = [...cart, { product, quantity: 1 }];
    }

    saveCart(updatedCart);
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart = [];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: Math.min(product.stock, updatedCart[existingIndex].quantity + quantity),
      };
    } else {
      updatedCart = [...cart, { product, quantity }];
    }

    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // 2. ORDER PROCESSING & CLIENT INTEGRATION
  const handlePlaceOrder = (newOrder: Order) => {
    // A: Record the order
    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);

    // B: Deduct product stocks
    const updatedProducts = products.map((prod) => {
      const purchasedItem = newOrder.items.find((item) => item.productId === prod.id);
      if (purchasedItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - purchasedItem.quantity),
        };
      }
      return prod;
    });
    saveProducts(updatedProducts);

    // C: Update or create customer profile
    const existingCustIndex = customers.findIndex(
      (c) => c.email.toLowerCase() === newOrder.customerEmail.toLowerCase()
    );
    let updatedCustomers = [...customers];

    if (existingCustIndex > -1) {
      // Existing client
      const cust = customers[existingCustIndex];
      const updatedCustOrders = [
        {
          orderId: newOrder.id,
          date: newOrder.date,
          total: newOrder.total,
          status: newOrder.status,
        },
        ...cust.orders,
      ];
      updatedCustomers[existingCustIndex] = {
        ...cust,
        orderCount: cust.orderCount + 1,
        totalSpent: cust.totalSpent + newOrder.total,
        orders: updatedCustOrders,
      };
    } else {
      // Create new client
      const newCust: Customer = {
        id: `c-0${customers.length + 1}`,
        name: newOrder.customerName,
        email: newOrder.customerEmail,
        phone: newOrder.shippingAddress.phone || '+1 (555) 012-0000',
        joinDate: newOrder.date,
        totalSpent: newOrder.total,
        orderCount: 1,
        orders: [
          {
            orderId: newOrder.id,
            date: newOrder.date,
            total: newOrder.total,
            status: newOrder.status,
          },
        ],
      };
      updatedCustomers = [newCust, ...updatedCustomers];
    }
    saveCustomers(updatedCustomers);

    // D: Sync order to Supabase table
    const syncOrderToSupabase = async () => {
      try {
        await supabase.from('orders').insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          customer_email: newOrder.customerEmail,
          items: newOrder.items,
          total: newOrder.total,
          date: newOrder.date,
          status: newOrder.status,
          shipping_address: newOrder.shippingAddress,
          payment_method: newOrder.paymentMethod
        });
      } catch (err) {
        console.warn('Failed to insert order to Supabase:', err);
      }
    };
    syncOrderToSupabase();
  };

  // 3. ADMIN PRODUCT CRUD HANDLERS
  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    saveProducts(updated);

    const syncProductToSupabase = async () => {
      try {
        await supabase.from('products').insert({
          id: newProd.id,
          name: newProd.name,
          price: newProd.price,
          original_price: newProd.originalPrice,
          short_description: newProd.shortDescription,
          description: newProd.description,
          ingredients: newProd.ingredients,
          key_active: newProd.keyActive,
          usage: newProd.usage,
          category: newProd.category,
          image: newProd.image,
          rating: newProd.rating,
          reviews_count: newProd.reviewsCount,
          stock: newProd.stock,
          tags: newProd.tags
        });
      } catch (err) {}
    };
    syncProductToSupabase();
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    saveProducts(updated);

    const syncUpdateToSupabase = async () => {
      try {
        await supabase.from('products').update({
          name: updatedProd.name,
          price: updatedProd.price,
          original_price: updatedProd.originalPrice,
          short_description: updatedProd.shortDescription,
          description: updatedProd.description,
          ingredients: updatedProd.ingredients,
          key_active: updatedProd.keyActive,
          usage: updatedProd.usage,
          category: updatedProd.category,
          image: updatedProd.image,
          rating: updatedProd.rating,
          reviews_count: updatedProd.reviewsCount,
          stock: updatedProd.stock,
          tags: updatedProd.tags
        }).eq('id', updatedProd.id);
      } catch (err) {}
    };
    syncUpdateToSupabase();
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProducts(updated);

    const syncDeleteToSupabase = async () => {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (err) {}
    };
    syncDeleteToSupabase();
  };

  // 4. ADMIN ORDER STATUS MODIFICATION
  const handleUpdateOrderStatus = (orderId: string, status: 'Pending' | 'Shipped' | 'Delivered') => {
    // Update order state
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    saveOrders(updatedOrders);

    // Update corresponding customer order state log
    const updatedCustomers = customers.map((c) => {
      const orderIdx = c.orders.findIndex((or) => or.orderId === orderId);
      if (orderIdx > -1) {
        const updatedCustOrders = [...c.orders];
        updatedCustOrders[orderIdx] = {
          ...updatedCustOrders[orderIdx],
          status,
        };
        return {
          ...c,
          orders: updatedCustOrders,
        };
      }
      return c;
    });
    saveCustomers(updatedCustomers);

    const syncOrderStatusToSupabase = async () => {
      try {
        await supabase.from('orders').update({ status }).eq('id', orderId);
      } catch (err) {}
    };
    syncOrderStatusToSupabase();
  };

  // Helper selectors
  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const filteredStoreProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleCategorySelectFromNav = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedProduct(null); // Return to grid if detail view is active
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative" id="app-viewport">
      
      {/* 1. NAVIGATION BAR */}
      <Navbar
        cartCount={totalCartCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedProduct(null); // Reset detail view when hopping tabs
        }}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelectFromNav}
        userAuthNode={
          <UserAuth 
            orders={orders}
            onLoginStateChange={(email, name) => {
              setCurrentUserEmail(email);
              setCurrentUserName(name);
            }}
            onOrdersFetched={(dbOrders) => {
              setOrders(prevOrders => {
                const combined = [...dbOrders, ...prevOrders];
                const unique = combined.filter((val, index, self) => 
                  self.findIndex(t => t.id === val.id) === index
                );
                localStorage.setItem('sian_orders', JSON.stringify(unique));
                return unique;
              });
            }}
          />
        }
      />

      {/* 2. MAIN LAYOUT DEVIATION */}
      {currentView === 'store' ? (
        <div className="flex-grow animate-fadeIn" id="storefront-container">
          
          {/* Main Storefront view: Hero & catalog OR Product Specs sheet */}
          {selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onEditProduct={handleStorefrontEditProduct}
            />
          ) : (
            <>
              <div className="space-y-12 pb-16">
                
                {/* HERO BANNER */}
                <Hero 
                  products={products}
                  onProductClick={(p) => setSelectedProduct(p)}
                  onExploreClick={() => {
                    const el = document.getElementById('catalog-grid-header');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }} 
                />

                {/* PRODUCTS CATALOG SECTION */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20" id="catalog-section">
                  
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-slate-100 pb-4" id="catalog-grid-header">
                    <div className="text-left space-y-1">
                      <span className="font-mono text-[9px] text-brand-mint font-bold tracking-widest uppercase block">
                        Active Scientific Formulations
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-slate-950">
                        {selectedCategory === 'All' ? 'The Complete Collection' : selectedCategory}
                      </h2>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 mt-1 md:mt-0">
                      Showing {filteredStoreProducts.length} of {products.length} lab listings
                    </span>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                    {filteredStoreProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onProductClick={(p) => setSelectedProduct(p)}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onEditProduct={handleStorefrontEditProduct}
                      />
                    ))}
                  </div>

                  {filteredStoreProducts.length === 0 && (
                    <div className="py-20 text-center font-mono text-slate-400 text-xs">
                      NO ACTIVE BATCH LABELS CORRESPONDING TO THIS CATEGORY.
                    </div>
                  )}
                </section>
              </div>

              {/* BRAND PHILOSOPHY / ABOUT SECTION */}
              <section className="bg-slate-900 text-white py-16 px-4 md:px-8 border-t border-slate-800" id="philosophy-section">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
                  <div className="md:col-span-5 space-y-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-emerald-400 font-bold uppercase">
                      Scientific Transparency
                    </span>
                    <h3 className="font-serif text-3xl font-semibold leading-tight text-white">
                      Fusing Biotechnology with Botanical Wisdom
                    </h3>
                  </div>
                  
                  <div className="md:col-span-7 space-y-4 text-slate-300 font-light text-sm leading-relaxed">
                    <p>
                      At SianLab.com, we reject the notion that skincare should rely on smoke and mirrors. Every single formula imported from our Shanghai facility underwent rigorous clinical assessment. We focus heavily on bio-pure peptides, plant-derived squalane, and active mycelium extracts.
                    </p>
                    <p>
                      Our close collaboration with elite dermatological research clinics ensures that our imports satisfy stringent safety profiles while pushing the boundaries of cell hydration, tissue firming, and dermal luminosity.
                    </p>
                    <div className="flex gap-4 pt-3 text-[11px] font-mono font-semibold text-white">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> SGS LABS VERIFIED
                      </span>
                      <span>•</span>
                      <span>CRUELTY FREE</span>
                      <span>•</span>
                      <span>99.8% BIO-PURE</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      ) : (
        /* 3. ADMINISTRATIVE CONTROL DASHBOARD */
        <div className="flex-grow animate-fadeIn" id="admin-panel-viewport">
          {!isAdminAuthenticated ? (
            <AdminLogin
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                sessionStorage.setItem('sian_admin_authenticated', 'true');
              }}
              onCancel={() => {
                setCurrentView('store');
              }}
            />
          ) : (
            <AdminDashboard
              products={products}
              orders={orders}
              customers={customers}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              initialEditingProduct={adminEditProduct}
              onClearInitialEditingProduct={() => setAdminEditProduct(null)}
              onLogout={() => {
                setIsAdminAuthenticated(false);
                sessionStorage.removeItem('sian_admin_authenticated');
                setCurrentView('store');
              }}
            />
          )}
        </div>
      )}

      {/* 4. FLOATING SHOPPING CART DRAWER (STOREFRONT ONLY) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        currentUserEmail={currentUserEmail}
        currentUserName={currentUserName}
      />

      {/* 5. FOOTER */}
      <footer className="h-12 bg-slate-900 border-t border-slate-800/65 flex flex-col sm:flex-row items-center px-8 justify-between shrink-0 py-2 sm:py-0 gap-2">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold select-none">
            Sian<span className="font-bold">Lab</span><span className="text-[8px] text-emerald-400 font-mono font-bold">.COM</span> Premium Skincare
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest">Lab ID: SL-2991-CH</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-mono font-bold select-all">MADE BY JAMIL 01307541441</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Cloud Systems Online</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
