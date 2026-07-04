import React, { useState, useMemo, useEffect } from 'react';
import { 
  Beaker, Database, ClipboardList, Users, Plus, Edit3, Trash2, Search, 
  TrendingUp, ShoppingBag, ArrowUpRight, DollarSign, CheckCircle2, Truck, RefreshCw, X, LogOut
} from 'lucide-react';
import { Product, Order, Customer } from '../types';
import { SALES_HISTORY } from '../data/initialData';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: 'Pending' | 'Shipped' | 'Delivered') => void;
  initialEditingProduct?: Product | null;
  onClearInitialEditingProduct?: () => void;
  onLogout?: () => void;
}

type AdminTab = 'overview' | 'products' | 'orders' | 'customers';

export default function AdminDashboard({
  products,
  orders,
  customers,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  initialEditingProduct,
  onClearInitialEditingProduct,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Trigger editing when initialized from props
  useEffect(() => {
    if (initialEditingProduct) {
      setActiveTab('products');
      openEditModal(initialEditingProduct);
      if (onClearInitialEditingProduct) {
        onClearInitialEditingProduct();
      }
    }
  }, [initialEditingProduct]);

  // Form states for Add/Edit
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: 'Serums & Essences',
    image: '',
    shortDescription: '',
    description: '',
    keyActive: '',
    ingredientsText: '',
    tagsText: 'Lab Tested',
  });

  // Calculate Metrics based on current state
  const totalSales = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const totalOrders = orders.length;
  const activeUsers = customers.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Custom Interactive SVG Area Chart dimensions & coordinates
  const chartHeight = 220;
  const chartWidth = 500;
  const maxSaleValue = Math.max(...SALES_HISTORY.map(d => d.sales));
  const points = useMemo(() => {
    return SALES_HISTORY.map((d, index) => {
      const x = (index / (SALES_HISTORY.length - 1)) * chartWidth;
      const y = chartHeight - (d.sales / maxSaleValue) * (chartHeight - 40);
      return { x, y, ...d };
    });
  }, [maxSaleValue]);

  // SVG Area path generator
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const lineCoords = points.map(p => `${p.x},${p.y}`).join(' L ');
    return `M 0,${chartHeight} L ${lineCoords} L ${chartWidth},${chartHeight} Z`;
  }, [points]);

  // SVG Line path generator
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  }, [points]);

  const [hoveredDataPoint, setHoveredDataPoint] = useState<typeof SALES_HISTORY[0] | null>(null);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Filter orders based on search
  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  // Helper to pre-populate product form for Editing
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      image: p.image,
      shortDescription: p.shortDescription,
      description: p.description,
      keyActive: p.keyActive,
      ingredientsText: p.ingredients.join(', '),
      tagsText: p.tags.join(', '),
    });
  };

  // Helper to reset form
  const resetForm = () => {
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      category: 'Serums & Essences',
      image: '',
      shortDescription: '',
      description: '',
      keyActive: '',
      ingredientsText: '',
      tagsText: 'Lab Tested',
    });
    setEditingProduct(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || productForm.price <= 0 || productForm.stock < 0 || !productForm.image) {
      alert('Please fill out all primary variables.');
      return;
    }

    const ingredientsArray = productForm.ingredientsText
      ? productForm.ingredientsText.split(',').map(i => i.trim()).filter(Boolean)
      : ['Purified Water', 'Stabilizers'];

    const tagsArray = productForm.tagsText
      ? productForm.tagsText.split(',').map(t => t.trim()).filter(Boolean)
      : ['Lab Tested'];

    if (editingProduct) {
      // Edit mode
      const updated: Product = {
        ...editingProduct,
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category,
        image: productForm.image,
        shortDescription: productForm.shortDescription || 'Clinical-grade skin solution.',
        description: productForm.description || 'No detailed lab profile entered.',
        keyActive: productForm.keyActive || 'Active Complex',
        ingredients: ingredientsArray,
        tags: tagsArray,
      };
      onUpdateProduct(updated);
    } else {
      // Add mode
      const newId = `sian-new-${Math.floor(100 + Math.random() * 900)}`;
      const newProd: Product = {
        id: newId,
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category,
        image: productForm.image,
        shortDescription: productForm.shortDescription || 'Clinical-grade skin solution.',
        description: productForm.description || 'No detailed lab profile entered.',
        keyActive: productForm.keyActive || 'Active Complex',
        ingredients: ingredientsArray,
        usage: 'Apply 2–3 drops to clean skin morning and night, pressing gently until absorbed.',
        rating: 5.0,
        reviewsCount: 1,
        tags: tagsArray,
      };
      onAddProduct(newProd);
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  const handleDeleteProductConfirm = () => {
    if (deletingProduct) {
      onDeleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#F2F5F5]" id="admin-panel-container">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 shrink-0 p-6 flex flex-col justify-between text-slate-800" id="admin-sidebar">
        <div>
          {/* Scientific Status Panel */}
          <div className="pb-6 border-b border-slate-200 mb-6 flex flex-col text-left">
            <span className="font-mono text-[9px] text-emerald-600 font-bold tracking-widest uppercase block">
              CONSOLE SECURITY: LEVEL_A
            </span>
            <h3 className="font-sans font-bold text-slate-850 text-sm mt-1">SianLab System Host</h3>
            <div className="flex items-center gap-2 mt-2.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-emerald-750 font-mono text-[9px] w-fit font-bold">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Live Storefront</span>
            </div>
          </div>

          {/* Nav List Header */}
          <div className="mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-left">
            Main Modules
          </div>

          {/* Nav list */}
          <nav className="space-y-4 text-left">
            <button
              onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-4 text-xs font-semibold uppercase tracking-wider transition-all py-1 ${
                activeTab === 'overview'
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${activeTab === 'overview' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <TrendingUp className={`w-3 h-3 ${activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-4 text-xs font-semibold uppercase tracking-wider transition-all py-1 ${
                activeTab === 'products'
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${activeTab === 'products' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <Beaker className={`w-3 h-3 ${activeTab === 'products' ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
              <span>Inventory</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-4 text-xs font-semibold uppercase tracking-wider transition-all py-1 ${
                activeTab === 'orders'
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${activeTab === 'orders' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <ClipboardList className={`w-3 h-3 ${activeTab === 'orders' ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
              <span>Orders</span>
            </button>

            <button
              onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-4 text-xs font-semibold uppercase tracking-wider transition-all py-1 ${
                activeTab === 'customers'
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${activeTab === 'customers' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <Users className={`w-3 h-3 ${activeTab === 'customers' ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
              <span>Customers</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-4 text-xs font-semibold uppercase tracking-wider transition-all py-1 pt-4 border-t border-slate-100 text-red-600 hover:text-red-750"
                id="admin-logout-sidebar-btn"
              >
                <div className="w-5 h-5 rounded flex items-center justify-center bg-red-50 hover:bg-red-100 transition-all">
                  <LogOut className="w-3 h-3 text-red-600" />
                </div>
                <span>Log Out Console</span>
              </button>
            )}
          </nav>
        </div>

        {/* Console Footprint */}
        <div className="hidden lg:block mt-auto text-left">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Lab Support</p>
            <p className="text-xs leading-relaxed text-slate-600 font-light">Import customs clearing in progress for batch #C441.</p>
          </div>
        </div>
      </aside>

      {/* ADMIN CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* TOP BAR / SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
              ADMIN CONTROL BOARD
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 capitalize">
              {activeTab === 'overview' && 'System Analytics'}
              {activeTab === 'products' && 'Formulation Registry'}
              {activeTab === 'orders' && 'Acquisition Ledger'}
              {activeTab === 'customers' && 'Client Demographics'}
            </h1>
          </div>

          {/* Search tool - hidden on overview */}
          {activeTab !== 'overview' && (
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Query ${activeTab}...`}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:glowing-border focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-mono text-[10px]"
                >
                  CLEAR
                </button>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: OVERVIEW ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 4 GLOWING METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-mint"></div>
                <div className="text-left space-y-1.5">
                  <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                  <strong className="block font-mono text-2xl font-bold text-slate-900">${totalSales}.00</strong>
                  <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 font-semibold">
                    <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
                  </span>
                </div>
                <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900"></div>
                <div className="text-left space-y-1.5">
                  <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">Formulations Sold</span>
                  <strong className="block font-mono text-2xl font-bold text-slate-900">{totalOrders} units</strong>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    Processed Securely
                  </span>
                </div>
                <div className="w-11 h-11 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400"></div>
                <div className="text-left space-y-1.5">
                  <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">Client Cohort</span>
                  <strong className="block font-mono text-2xl font-bold text-slate-900">{activeUsers} active</strong>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Retention: 84%
                  </span>
                </div>
                <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-mint-dark"></div>
                <div className="text-left space-y-1.5">
                  <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">Avg Order Volume</span>
                  <strong className="block font-mono text-2xl font-bold text-slate-900">${averageOrderValue}.00</strong>
                  <span className="text-[10px] text-slate-500 font-mono">
                    AOV Standard Metric
                  </span>
                </div>
                <div className="w-11 h-11 rounded-lg bg-emerald-50 text-brand-mint-dark flex items-center justify-center">
                  <Beaker className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* CHART & DETAILS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Interactive SVG Area Chart (Bespoke Luxury Visual) */}
              <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-100 shadow-xs text-left space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-slate-900">Laboratory Sales Projection</h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">HISTORICAL ACQUISITION PROGRESSION INDEX</p>
                  </div>
                  
                  {hoveredDataPoint ? (
                    <div className="p-1.5 px-3 rounded bg-slate-950 text-white font-mono text-[10px] flex items-center gap-2">
                      <span className="text-brand-mint font-semibold">{hoveredDataPoint.month}:</span>
                      <span>${hoveredDataPoint.sales}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">Hover nodes to inspect</span>
                  )}
                </div>

                {/* SVG Chart Container */}
                <div className="w-full overflow-hidden">
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="w-full h-auto overflow-visible select-none"
                    id="scientific-sales-chart"
                  >
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5cd699" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#5cd699" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Background Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => {
                      const y = 40 + (i / 4) * (chartHeight - 80);
                      return (
                        <g key={i}>
                          <line 
                            x1="0" 
                            y1={y} 
                            x2={chartWidth} 
                            y2={y} 
                            stroke="#f1f5f9" 
                            strokeWidth="1" 
                          />
                          <text 
                            x="4" 
                            y={y - 4} 
                            className="font-mono text-[8px] fill-slate-300"
                          >
                            ${Math.round(maxSaleValue * (1 - i / 4))}
                          </text>
                        </g>
                      );
                    })}

                    {/* Gradient Area Fill */}
                    <path 
                      d={areaPath} 
                      fill="url(#chartGlow)" 
                    />

                    {/* Glowing Stroke line */}
                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                    />

                    {/* Interactive Data Nodes */}
                    {points.map((p, index) => (
                      <g key={index}>
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r={hoveredDataPoint?.month === p.month ? "6" : "3.5"} 
                          fill={hoveredDataPoint?.month === p.month ? "#059669" : "#5cd699"} 
                          stroke="#ffffff" 
                          strokeWidth="1.5"
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredDataPoint(p)}
                          onMouseLeave={() => setHoveredDataPoint(null)}
                        />
                        {/* Month names */}
                        <text 
                          x={p.x} 
                          y={chartHeight - 6} 
                          textAnchor="middle" 
                          className="font-mono text-[8px] fill-slate-400 font-semibold"
                        >
                          {p.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Side Panels: Stacking preview and signals */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Storefront Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 flex flex-col shadow-xs relative overflow-hidden h-[330px] text-left">
                  <div className="bg-emerald-500 h-1 absolute top-0 left-0 right-0"></div>
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">Storefront Preview</h2>
                      <span className="text-[9px] text-slate-400 font-mono">Mobile View</span>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-250 overflow-hidden flex flex-col">
                      <div className="h-16 bg-gradient-to-br from-slate-800 to-emerald-900 p-3 flex flex-col justify-center shrink-0">
                        <h4 className="text-white text-[11px] font-serif italic leading-none">Glass Skin Innovation</h4>
                        <button className="mt-1.5 w-max px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/20 text-[7px] text-white uppercase tracking-[0.2em] pointer-events-none">Shop Now</button>
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-2">
                        <div className="bg-white p-1.5 rounded border border-slate-100">
                          <div className="aspect-square bg-slate-100 rounded mb-1"></div>
                          <div className="h-1.5 w-10 bg-slate-200 rounded mb-0.5"></div>
                          <div className="h-1 w-6 bg-slate-100 rounded"></div>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-slate-100">
                          <div className="aspect-square bg-slate-100 rounded mb-1"></div>
                          <div className="h-1.5 w-10 bg-slate-200 rounded mb-0.5"></div>
                          <div className="h-1 w-6 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                      <div className="mt-auto p-2.5 bg-white border-t border-slate-150">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-bold">Cart (2)</span>
                          <span className="text-[9px] text-emerald-600 font-bold">$234.00</span>
                        </div>
                        <button className="w-full py-1 bg-emerald-500 text-white text-[8px] font-bold rounded uppercase tracking-widest pointer-events-none">Instant Checkout</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Order Stream overview */}
                <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs text-left space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-base font-semibold text-slate-900">Recent Signals</h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">LATEST TRANSACTION STREAM</p>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {orders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-slate-900 block">{o.id}</span>
                          <span className="text-[10px] text-slate-500 font-light block truncate max-w-[120px]">{o.customerName}</span>
                        </div>
                        
                        <div className="text-right space-y-0.5">
                          <span className="font-mono font-semibold text-slate-800 block">${o.total}</span>
                          <span className={`text-[8px] font-mono font-bold uppercase ${
                            o.status === 'Delivered' ? 'text-emerald-600' : o.status === 'Shipped' ? 'text-teal-600' : 'text-amber-600'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT (CRUD) */}
        {activeTab === 'products' && (
          <div className="space-y-5 animate-fadeIn text-left">
            
            {/* Header toolbar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
              <span className="font-mono text-xs text-slate-500">
                Registered Formulas: <strong>{filteredProducts.length}</strong> listings matching filters
              </span>
              
              <button
                onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
                id="add-new-product-trigger"
              >
                <Plus className="w-4 h-4" />
                Synthesize New Product
              </button>
            </div>

            {/* Products Table container */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                      <th className="py-4 px-5">Image</th>
                      <th className="py-4 px-4">Formula specs</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4 text-right">Valuation</th>
                      <th className="py-4 px-4 text-center">Batch Stock</th>
                      <th className="py-4 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Image column */}
                        <td className="py-3 px-5">
                          <div className="w-10 h-10 rounded border border-slate-100 bg-slate-50 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </td>

                        {/* Title spec column */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="space-y-0.5">
                            <strong className="font-semibold text-slate-900 text-sm leading-tight block">{p.name}</strong>
                            <div className="flex gap-1 items-center">
                              <span className="font-mono text-[8px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded uppercase">ID: {p.id}</span>
                              <span className="font-mono text-[8px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded">Active: {p.keyActive}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category column */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {p.category}
                        </td>

                        {/* Valuation Column */}
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                          ${p.price}.00
                        </td>

                        {/* Stock column */}
                        <td className="py-3 px-4 text-center">
                          <span className={`font-mono font-bold px-2 py-1 rounded text-xs ${
                            p.stock === 0 
                              ? 'bg-rose-50 text-rose-700' 
                              : p.stock <= 20 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                              title="Modify formula specs"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingProduct(p)}
                              className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Deprecate product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                    
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-mono text-xs">
                          NO ACTIVE FORMULATIONS REGISTERED UNDER FILTER SPECS.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDER TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-5 animate-fadeIn text-left">
            <p className="text-xs text-slate-500 font-light bg-white p-4 rounded-xl border border-slate-100">
              The following represents the SianLab global fulfillment queue. Bio-skincare compound chains require strict timing from Shanghai labs to local doorsteps.
            </p>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                      <th className="py-4 px-5">ID</th>
                      <th className="py-4 px-4">Authorized Client</th>
                      <th className="py-4 px-4">Formulation Items</th>
                      <th className="py-4 px-4">Delivery Node</th>
                      <th className="py-4 px-4 text-right">Settled Amount</th>
                      <th className="py-4 px-4 text-center">Queue Status</th>
                      <th className="py-4 px-4 text-center">Advance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* ID */}
                        <td className="py-4 px-5 font-mono font-bold text-slate-900 text-sm">
                          {o.id}
                        </td>

                        {/* Client details */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <strong className="font-semibold text-slate-900 block">{o.customerName}</strong>
                            <span className="text-[10px] text-slate-500 font-mono block">{o.customerEmail}</span>
                          </div>
                        </td>

                        {/* Formula items */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="space-y-1 text-[11px] text-slate-600 font-light">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-slate-50 p-1 px-2 rounded border border-slate-100/50">
                                <span className="truncate max-w-[140px] font-medium text-slate-800">{item.productName}</span>
                                <span className="font-mono text-[10px] text-slate-400">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Shipping destination */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="text-[11px] text-slate-600 leading-normal font-light">
                            {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.postalCode}, {o.shippingAddress.country}
                          </div>
                        </td>

                        {/* Total amount settled */}
                        <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                          ${o.total}.00
                        </td>

                        {/* Current Status Badge */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                            o.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : o.status === 'Shipped' 
                              ? 'bg-teal-50 text-teal-700 border border-teal-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {o.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                            {o.status === 'Shipped' && <Truck className="w-3 h-3" />}
                            {o.status === 'Pending' && <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />}
                            {o.status}
                          </span>
                        </td>

                        {/* Quick Action drop down triggers to advance status */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {o.status === 'Pending' && (
                              <button
                                onClick={() => onUpdateOrderStatus(o.id, 'Shipped')}
                                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-mono text-[10px] uppercase font-semibold tracking-wider rounded transition-colors"
                              >
                                Ship Cargo
                              </button>
                            )}
                            {o.status === 'Shipped' && (
                              <button
                                onClick={() => onUpdateOrderStatus(o.id, 'Delivered')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] uppercase font-semibold tracking-wider rounded transition-colors"
                              >
                                Deliver Cargo
                              </button>
                            )}
                            {o.status === 'Delivered' && (
                              <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wide">
                                ARCHIVED RECORD
                              </span>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-mono text-xs">
                          NO ACTIVE TRANSACTIONS FOUND UNDER QUEUE CRITERIA.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS LEDGER */}
        {activeTab === 'customers' && (
          <div className="space-y-5 animate-fadeIn text-left">
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                      <th className="py-4 px-5">ID</th>
                      <th className="py-4 px-4">Client Contact</th>
                      <th className="py-4 px-4">Registry Date</th>
                      <th className="py-4 px-4 text-center">Formulations Procured</th>
                      <th className="py-4 px-4 text-right">Total Contributed</th>
                      <th className="py-4 px-5">Direct Transaction Ledger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* ID */}
                        <td className="py-4 px-5 font-mono text-slate-400">
                          {c.id}
                        </td>

                        {/* Client details */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <strong className="font-semibold text-slate-900 text-sm">{c.name}</strong>
                            <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
                              <span className="block">{c.email}</span>
                              <span className="block">{c.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Join Date */}
                        <td className="py-4 px-4 font-mono text-slate-500">
                          {c.joinDate}
                        </td>

                        {/* Total order units */}
                        <td className="py-4 px-4 text-center font-mono font-semibold text-slate-800">
                          {c.orderCount} orders
                        </td>

                        {/* Total spend contribution */}
                        <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                          ${c.totalSpent}.00
                        </td>

                        {/* Inline sub list of customer orders */}
                        <td className="py-4 px-5">
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {c.orders.map((or) => (
                              <div key={or.orderId} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-200 font-mono text-[9px]">
                                <span className="font-bold text-slate-800">{or.orderId}</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500">${or.total}</span>
                                <span className="text-slate-300">•</span>
                                <span className={`font-semibold uppercase ${
                                  or.status === 'Delivered' ? 'text-emerald-600' : or.status === 'Shipped' ? 'text-teal-600' : 'text-amber-600'
                                }`}>
                                  {or.status[0]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                      </tr>
                    ))}

                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-mono text-xs">
                          NO ACTIVE REGISTERED CLIENTS IN DEMOGRAPHICS DATABASE.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="add-edit-product-modal">
          {/* Backdrop blur */}
          <div onClick={() => { resetForm(); setIsAddModalOpen(false); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-scaleIn text-left">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {editingProduct ? 'Modify Chemical Formula Spec' : 'Synthesize New Formula Listing'}
              </h3>
              <button 
                onClick={() => { resetForm(); setIsAddModalOpen(false); }}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[calc(80vh)] overflow-y-auto">
              
              {/* Product Title */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="GHK-Cu Copper Peptide Activator"
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                />
              </div>

              {/* Grid: Price and Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Valuation Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="98"
                    className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Batch Stock Count *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock !== undefined ? productForm.stock : ''}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Formulation Category *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none bg-white"
                >
                  <option value="Serums & Essences">Serums & Essences</option>
                  <option value="Moisturizers & Balms">Moisturizers & Balms</option>
                  <option value="Specialized Treatments">Specialized Treatments</option>
                </select>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none font-mono"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Short Scientific Spec (1 line) *</label>
                <input
                  type="text"
                  required
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  placeholder="Advanced cellular repair serum formulated with 1.5% pure GHK-Cu."
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                />
              </div>

              {/* Primary Active */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Key Active Complex Complex</label>
                <input
                  type="text"
                  value={productForm.keyActive}
                  onChange={(e) => setProductForm({ ...productForm, keyActive: e.target.value })}
                  placeholder="1.5% Pure GHK-Cu & Dual EGF Matrix"
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Detailed Botanical/Clinical Profile</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe biological mechanism, lab trials, skin results..."
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none leading-normal font-sans"
                />
              </div>

              {/* Ingredients comma text */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Chemical Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={productForm.ingredientsText}
                  onChange={(e) => setProductForm({ ...productForm, ingredientsText: e.target.value })}
                  placeholder="GHK-Cu, Sodium Hyaluronate, Centella, Panthenol"
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                />
              </div>

              {/* Tags comma text */}
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Diagnostic Tags (comma separated)</label>
                <input
                  type="text"
                  value={productForm.tagsText}
                  onChange={(e) => setProductForm({ ...productForm, tagsText: e.target.value })}
                  placeholder="Authentic Sourced, Lab Tested, Best Seller"
                  className="w-full px-3 py-2 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { resetForm(); setIsAddModalOpen(false); }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono uppercase font-semibold tracking-wider rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono uppercase font-semibold tracking-wider rounded shadow"
                >
                  {editingProduct ? 'Update Listing' : 'Commit Synthesis'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeletingProduct(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"></div>
          
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-100 p-6 text-center animate-scaleIn text-left">
            <h3 className="font-serif font-bold text-lg text-slate-900">Deprecate Formulation?</h3>
            <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
              Are you sure you wish to permanently purge the formulation <strong className="font-semibold text-slate-800">{deletingProduct.name}</strong> from the SianLab active registry? This will render it unavailable for storefront clients instantly.
            </p>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono uppercase font-semibold tracking-wider rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProductConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono uppercase font-semibold tracking-wider rounded shadow"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
