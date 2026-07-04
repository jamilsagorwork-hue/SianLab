import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, CreditCard, CheckCircle, Smartphone, Globe, Beaker } from 'lucide-react';
import { CartItem, Product, ShippingAddress, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  currentUserEmail?: string | null;
  currentUserName?: string | null;
}

type CheckoutStep = 'review' | 'shipping' | 'payment' | 'confirmation';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  currentUserEmail,
  currentUserName,
}: CartDrawerProps) {
  const [step, setStep] = useState<CheckoutStep>('review');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'alipay' | 'apple'>('credit');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [shippingForm, setShippingForm] = useState<ShippingAddress>({
    name: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  // Prefill shipping info if user is logged in
  React.useEffect(() => {
    if (isOpen && (currentUserName || currentUserEmail)) {
      setShippingForm(prev => ({
        ...prev,
        name: prev.name || currentUserName || '',
        phone: prev.phone || '',
      }));
    }
  }, [isOpen, currentUserName, currentUserEmail]);

  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxAndDuties = Math.round(subtotal * 0.08); // 8% duties
  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const grandTotal = subtotal + taxAndDuties + shippingFee;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingForm.name && shippingForm.street && shippingForm.city && shippingForm.postalCode) {
      setStep('payment');
    } else {
      alert('Please populate all required scientific shipping records.');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate simulated secure Order ID
    const randomId = `SL-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const orderPayload: Order = {
      id: randomId,
      customerName: shippingForm.name,
      customerEmail: currentUserEmail || `${shippingForm.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      total: grandTotal,
      date: dateStr,
      status: 'Pending',
      shippingAddress: { ...shippingForm },
      paymentMethod: paymentMethod === 'credit' 
        ? `Visa Ending ${cardForm.number.slice(-4) || '4242'}` 
        : paymentMethod === 'alipay' 
        ? 'Alipay Pro' 
        : 'Apple Pay Bio',
    };

    // Propagate Order up to the main application state
    onPlaceOrder(orderPayload);
    setCreatedOrder(orderPayload);
    setStep('confirmation');
  };

  const handleFinishCheckout = () => {
    onClearCart();
    setStep('review');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      {/* Black backdrop blur */}
      <div 
        onClick={step !== 'confirmation' ? onClose : undefined}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-100 flex flex-col shadow-2xl h-full relative animate-slideLeft">
          
          {/* Header section */}
          <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                <Beaker className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <h2 className="font-display font-bold text-sm tracking-widest text-slate-900 uppercase">
                {step === 'review' && 'Acquisitions Cart'}
                {step === 'shipping' && 'Shipping Registry'}
                {step === 'payment' && 'Biometric Ledger'}
                {step === 'confirmation' && 'Acquisition Confirmed'}
              </h2>
            </div>
            
            {step !== 'confirmation' && (
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                id="close-cart"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Checkout Steps Progress Visual */}
          {step !== 'confirmation' && (
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-2.5 flex justify-between text-[10px] font-mono text-slate-400">
              <span className={step === 'review' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>1. CART REVIEW</span>
              <span>→</span>
              <span className={step === 'shipping' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>2. SHIPPING</span>
              <span>→</span>
              <span className={step === 'payment' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>3. SETTLEMENT</span>
            </div>
          )}

          {/* Step 1: Cart Review */}
          {step === 'review' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
                    <Beaker className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-slate-800">Your lab cart is empty</h3>
                    <p className="text-xs text-slate-400 font-light mt-1 max-w-[240px]">
                      Select scientific-grade formulation catalogs from the storefront to initiate checkout.
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-5 py-2 rounded-md bg-slate-900 text-white font-mono text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                  >
                    Browse Catalogs
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart list */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    {cartItems.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="flex gap-4 p-3 rounded-lg bg-white border border-slate-100 hover:border-slate-200/80 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-grow text-left flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 leading-snug">
                              {item.product.name}
                            </h4>
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                              {item.product.category}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity manipulation */}
                            <div className="flex items-center border border-slate-200 rounded">
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-50"
                              >
                                -
                              </button>
                              <span className="px-2 font-mono text-xs text-slate-800 font-medium">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                                className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-50"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-semibold text-slate-900">
                                ${item.product.price * item.quantity}
                              </span>
                              <button 
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-slate-300 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                                title="Remove formulation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Section */}
                  <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
                    <div className="space-y-1.5 text-xs text-slate-500 font-mono">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="text-slate-800">${subtotal}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Import Duties & Custom Tax (8%)</span>
                        <span className="text-slate-800">${taxAndDuties}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clinical Air Cargo Shipping</span>
                        <span className="text-slate-800">
                          {shippingFee === 0 ? <strong className="text-emerald-600 uppercase font-semibold">FREE</strong> : `$${shippingFee}.00`}
                        </span>
                      </div>
                      {shippingFee > 0 && (
                        <p className="text-[9px] text-slate-400 font-sans italic text-left pt-0.5">
                          Add <strong>${150 - subtotal}</strong> more to qualify for complimentary premium carbon-neutral cargo.
                        </p>
                      )}
                      <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-sm font-bold text-slate-900">
                        <span>Grand Total (USD)</span>
                        <span>${grandTotal}.00</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep('shipping')}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-200"
                    >
                      Proceed to Shipping
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Shipping Form */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-left">
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Provide exact delivery specs. SianLab bio-products require controlled transit to maintain maximum compound shelf life.
                </p>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Recipient Name *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingForm.name}
                    onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                    placeholder="Dr. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Contact Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={shippingForm.phone || ''}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    placeholder="+1 (555) 341-9821"
                    className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Street Address *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    placeholder="404 Oakwood Heights Dr"
                    className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">City *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      placeholder="Seattle"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">State/Province *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      placeholder="WA"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Postal Code *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingForm.postalCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                      placeholder="98109"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Country *</label>
                    <select 
                      value={shippingForm.country}
                      onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none bg-white"
                    >
                      <option value="United States">United States</option>
                      <option value="China">China</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Italy">Italy</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action and back */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-200"
                >
                  Configure Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="w-full text-center py-2 text-xs font-mono font-semibold text-slate-500 hover:text-slate-900 uppercase transition-all"
                >
                  ← Adjust Cart
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payment Method Form */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-left">
                
                {/* Selector */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Select Settlement Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'credit'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('alipay')}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'alipay'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">Alipay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple')}
                      className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'apple'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-[9px] font-semibold tracking-wider uppercase font-mono">Apple Pay</span>
                    </button>
                  </div>
                </div>

                {/* Sub-form based on method */}
                {paymentMethod === 'credit' ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Card Number</label>
                      <input 
                        type="text" 
                        required
                        maxLength={19}
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Expiry Date</label>
                        <input 
                          type="text" 
                          required
                          maxLength={5}
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">Security Code (CVV)</label>
                        <input 
                          type="text" 
                          required
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          placeholder="882"
                          className="w-full px-3.5 py-2.5 rounded border border-slate-200 text-xs focus:glowing-border focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center gap-3.5 text-center animate-fadeIn">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 animate-pulse" />
                    <div className="text-left">
                      <h4 className="text-xs font-semibold text-slate-800">Compliant Biometric Checkout</h4>
                      <p className="text-[10px] text-slate-500 font-light leading-relaxed mt-0.5">
                        Redirect will bypass upon completion. Auth-keys will register automatically.
                      </p>
                    </div>
                  </div>
                )}

                {/* Micro order total reminder */}
                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500 uppercase">Order Grand Total</span>
                  <strong className="font-mono text-slate-900 text-sm">${grandTotal}.00 USD</strong>
                </div>

              </div>

              {/* Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold text-xs tracking-wider uppercase shadow-lg shadow-emerald-600/10 transition-all duration-200"
                >
                  Authenticate & Complete Order
                </button>
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="w-full text-center py-2 text-xs font-mono font-semibold text-slate-500 hover:text-slate-900 uppercase transition-all"
                >
                  ← Adjust Delivery Address
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Order Confirmation Splash */}
          {step === 'confirmation' && createdOrder && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-6 text-center">
              <div className="flex-grow flex flex-col items-center justify-center space-y-5 animate-scaleIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] text-emerald-600 font-bold tracking-widest uppercase block">
                    Secured Formulation Transaction Registered
                  </span>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Formulation Confirmed
                  </h3>
                  <p className="text-xs text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                    Thank you for selecting SianLab. Your custom formulation has been successfully registered under transaction code <strong className="font-mono font-semibold text-slate-900">{createdOrder.id}</strong>.
                  </p>
                </div>

                {/* Receipt Details Box */}
                <div className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-left font-mono text-[10px] text-slate-500 space-y-1.5">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5 mb-1.5 text-slate-800 font-semibold uppercase">
                    <span>Transaction Spec</span>
                    <span>Values</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="text-slate-900">{createdOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authorized Client</span>
                    <span className="text-slate-900">{createdOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Gateway</span>
                    <span className="text-slate-900">{createdOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Formulation Volume</span>
                    <span className="text-slate-900">
                      {createdOrder.items.reduce((acc, it) => acc + it.quantity, 0)} units
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/60 pt-1.5 mt-1.5 text-slate-900 font-bold">
                    <span>Settled Total</span>
                    <span>${createdOrder.total}.00 USD</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                  A serialized chemical batch report with cargo track links has been dispatched to <strong className="text-slate-600">{createdOrder.customerEmail}</strong>. Expected delivery in 3-5 business days.
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleFinishCheckout}
                  className="w-full py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-200"
                >
                  Seal Records & Exit
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
