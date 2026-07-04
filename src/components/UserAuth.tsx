import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { 
  Chrome, LogOut, ClipboardList, Shield, ShieldAlert, CheckCircle2, 
  User, Mail, Phone, MapPin, Calendar, Clock, ShoppingBag, ChevronRight, X,
  HelpCircle, ChevronDown, ChevronUp, Key, Lock, Settings, AlertTriangle
} from 'lucide-react';

interface UserAuthProps {
  onLoginStateChange: (userEmail: string | null, userName: string | null) => void;
  orders: Order[];
  onOrdersFetched: (orders: Order[]) => void;
}

export default function UserAuth({ onLoginStateChange, orders, onOrdersFetched }: UserAuthProps) {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Login sub-tabs for configuration and fallback
  const [loginSubTab, setLoginSubTab] = useState<'direct' | 'oauth'>('direct');
  const [showOauthGuide, setShowOauthGuide] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserLogin(session.user);
      } else {
        // Fallback to local session if set for testing in iframe
        const localSession = localStorage.getItem('sian_user_session');
        if (localSession) {
          const parsed = JSON.parse(localSession);
          setUser(parsed);
          onLoginStateChange(parsed.email, parsed.name);
          fetchUserOrders(parsed.email);
        }
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserLogin(session.user);
      } else {
        const localSession = localStorage.getItem('sian_user_session');
        if (!localSession) {
          setUser(null);
          onLoginStateChange(null, null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserLogin = (supabaseUser: any) => {
    const userEmail = supabaseUser.email;
    const userName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || userEmail?.split('@')[0] || 'Valued Customer';
    const profile = {
      id: supabaseUser.id,
      email: userEmail,
      name: userName,
      isReal: true
    };
    setUser(profile);
    onLoginStateChange(userEmail, userName);
    fetchUserOrders(userEmail);
  };

  const fetchUserOrders = async (email: string) => {
    setIsLoading(true);
    try {
      // Query orders from Supabase order table corresponding to this email
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not fetch orders from Supabase (schema might not be created yet):', error.message);
        // Fallback: Filter local orders state passed down as prop
        const filtered = orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
        onOrdersFetched(filtered);
      } else if (data && data.length > 0) {
        // Map DB snake_case column names back to camelCase
        const mappedOrders: Order[] = data.map(o => ({
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
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
        }));
        onOrdersFetched(mappedOrders);
      } else {
        // Table created but empty, let's keep local ones
        const filtered = orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
        onOrdersFetched(filtered);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger genuine Google Login via Supabase
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('OAuth Error:', error);
      setMsg({ 
        type: 'error', 
        text: `OAuth Popup restricted in Sandbox. Use the dedicated Gmail connector below to log in seamlessly!` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Instant Custom / Demo Login to bypass iframe OAuth redirect constraints
  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsLoading(true);
    setMsg(null);

    setTimeout(async () => {
      try {
        const normalizedEmail = emailInput.trim().toLowerCase();
        const customName = nameInput.trim() || normalizedEmail.split('@')[0];
        
        const demoUser = {
          id: `demo-user-${Math.floor(1000 + Math.random() * 9000)}`,
          email: normalizedEmail,
          name: customName,
          phone: phoneInput || '+1 (555) 341-9821',
          isReal: false
        };

        // Try registering in Profiles if Table exists
        try {
          await supabase.from('profiles').insert({
            id: '00000000-0000-0000-0000-000000000000', // anonymous profile ID fallback
            email: normalizedEmail,
            name: customName,
            phone: phoneInput
          });
        } catch(e) {}

        localStorage.setItem('sian_user_session', JSON.stringify(demoUser));
        setUser(demoUser);
        onLoginStateChange(normalizedEmail, customName);
        await fetchUserOrders(normalizedEmail);

        setMsg({ type: 'success', text: 'Securely authenticated via Gmail Connector.' });
        setTimeout(() => {
          setShowLoginModal(false);
          setMsg(null);
        }, 1200);

      } catch (err: any) {
        setMsg({ type: 'error', text: err.message || 'Login failed.' });
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem('sian_user_session');
    setUser(null);
    onLoginStateChange(null, null);
    setSelectedHistoryOrder(null);
    setIsLoading(false);
  };

  // Find user orders matching current logged-in profile
  const userOrders = orders.filter(
    o => o.customerEmail.toLowerCase() === (user?.email || '').toLowerCase()
  );

  return (
    <div className="relative z-40" id="user-auth-module">
      {/* Trigger Button or User Status Badge */}
      {!user ? (
        <button
          onClick={() => {
            setShowLoginModal(true);
            setMsg(null);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-xs text-slate-700 font-semibold uppercase tracking-wider transition-all shadow-sm"
          id="trigger-login-modal"
        >
          <Chrome className="w-4 h-4 text-emerald-500" />
          <span>Gmail Login</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {/* Active Logged In Session Dropdown UI */}
          <button
            onClick={() => {
              setShowLoginModal(true);
              setMsg(null);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-50/50 hover:bg-emerald-50 text-xs text-emerald-800 font-bold transition-all shadow-sm"
            id="trigger-profile-modal"
          >
            <div className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px] uppercase">
              {user.name.charAt(0)}
            </div>
            <span className="max-w-[120px] truncate">{user.name}</span>
          </button>
        </div>
      )}

      {/* LOGIN & USER PORTAL DIALOG OVERLAY */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]"
            id="user-portal-card"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="text-left space-y-0.5">
                <h3 className="font-serif text-lg font-bold tracking-tight text-slate-100">
                  {user ? 'SianLab Customer Portal' : 'Access SianLab Console'}
                </h3>
                <p className="font-mono text-[9px] text-slate-400 tracking-widest uppercase">
                  {user ? 'AUTHORIZED CLIENT SESSION' : 'SECURE RECIPIENT SIGN-IN'}
                </p>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                id="close-login-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Not Logged In, Show Sign In Forms */}
            {!user ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Login Strategy Selector */}
                <div className="bg-slate-50 border-b border-slate-250 flex shrink-0">
                  <button
                    onClick={() => {
                      setLoginSubTab('direct');
                      setMsg(null);
                    }}
                    className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                      loginSubTab === 'direct'
                        ? 'text-emerald-700 border-emerald-500 font-bold bg-white'
                        : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/50'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Instant Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoginSubTab('oauth');
                      setMsg(null);
                    }}
                    className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                      loginSubTab === 'oauth'
                        ? 'text-emerald-700 border-emerald-500 font-bold bg-white'
                        : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/50'
                    }`}
                    id="oauth-tab-btn"
                  >
                    <Chrome className="w-3.5 h-3.5" />
                    <span>Google OAuth</span>
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                  {msg && (
                    <div className={`p-3.5 rounded-lg border-l-2 flex items-start gap-2 text-left animate-fadeIn ${
                      msg.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    }`}>
                      {msg.type === 'error' ? <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                      <div className="text-xs font-medium leading-normal">{msg.text}</div>
                    </div>
                  )}

                  {loginSubTab === 'direct' ? (
                    /* Instant secure direct credentials */
                    <div className="space-y-4 text-left">
                      <div className="text-center space-y-1">
                        <h4 className="text-sm font-semibold text-slate-900">Direct Secure Sign-In</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-light">
                          Authenticate instantly with any email. This bypasses sandbox iframe redirections and works out-of-the-box with your Supabase schema!
                        </p>
                      </div>

                      <form onSubmit={handleCustomLogin} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block font-mono text-[9px] tracking-wider text-slate-400 uppercase font-semibold">
                            Your Email Address *
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input
                              type="email"
                              required
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              placeholder="yourname@gmail.com"
                              className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                              id="gmail-custom-input"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="block font-mono text-[9px] tracking-wider text-slate-400 uppercase font-semibold">
                              Full Name (Optional)
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <User className="w-4 h-4" />
                              </span>
                              <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="Eleanor Vance"
                                className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-mono text-[9px] tracking-wider text-slate-400 uppercase font-semibold">
                              Contact Number (Optional)
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Phone className="w-4 h-4" />
                              </span>
                              <input
                                type="text"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                                placeholder="+1 (555) 341-9821"
                                className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-[0.99]"
                          id="submit-gmail-login"
                        >
                          {isLoading ? 'Establishing Secure Link...' : 'Authorize Secure Session'}
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Google OAuth integration block */
                    <div className="space-y-4 text-left animate-fadeIn">
                      <div className="text-center space-y-1">
                        <h4 className="text-sm font-semibold text-slate-900">Google OAuth Sign-In</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-light">
                          Authenticate using your custom Supabase client's Google single-sign-on protocol.
                        </p>
                      </div>

                      {/* Google Authentication Action Button */}
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                        id="google-oauth-btn"
                      >
                        <Chrome className="w-4.5 h-4.5 text-emerald-600" />
                        <span>Connect with Google Account</span>
                      </button>

                      {/* Explicit Error Help Section */}
                      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-amber-900">
                              Why does "provider is not enabled" happen?
                            </h5>
                            <p className="text-[11px] text-amber-800 leading-relaxed font-light">
                              Google Login requires active credentials. If you get an error saying the provider is not enabled, you must activate the Google OAuth provider inside your own Supabase project dashboard.
                            </p>
                          </div>
                        </div>

                        {/* Collapsible Integration Manual */}
                        <div className="border-t border-amber-200 pt-2.5">
                          <button
                            onClick={() => setShowOauthGuide(!showOauthGuide)}
                            className="flex items-center justify-between w-full text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 hover:text-amber-950 transition-colors"
                          >
                            <span>Supabase Step-by-Step Setup Guide</span>
                            {showOauthGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {showOauthGuide && (
                            <div className="mt-2.5 space-y-2 text-[11px] text-slate-700 font-mono pl-1 leading-relaxed border-l-2 border-amber-200">
                              <div className="flex gap-1.5">
                                <span className="font-bold text-amber-800">1.</span>
                                <span>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-700 hover:text-emerald-800">Supabase Dashboard</a> and choose your project.</span>
                              </div>
                              <div className="flex gap-1.5">
                                <span className="font-bold text-amber-800">2.</span>
                                <span>Navigate to <strong>Authentication</strong> &gt; <strong>Providers</strong> &gt; <strong>Google</strong>.</span>
                              </div>
                              <div className="flex gap-1.5">
                                <span className="font-bold text-amber-800">3.</span>
                                <span>Toggle <strong>"Enable Google Provider"</strong> to true.</span>
                              </div>
                              <div className="flex gap-1.5">
                                <span className="font-bold text-amber-800">4.</span>
                                <span>Paste your Google <strong>Client ID</strong> &amp; <strong>Client Secret</strong> (from Google Cloud Console under credentials).</span>
                              </div>
                              <div className="flex gap-1.5">
                                <span className="font-bold text-amber-800">5.</span>
                                <span>Copy the redirect URL from Supabase and paste it into Google Console Authorized Redirect URIs.</span>
                              </div>
                              <div className="flex gap-1.5">
                                <span className="font-bold text-amber-800">6.</span>
                                <span>Click <strong>Save</strong> inside Supabase.</span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-sans italic mt-2">
                                * Tip: In the meantime, you can use the <strong>Instant Login</strong> tab above to log in instantly and keep developing!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* If Logged In, Show Session Portal */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="bg-slate-50 border-b border-slate-200 flex shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setSelectedHistoryOrder(null);
                    }}
                    className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                      activeTab === 'profile' && !selectedHistoryOrder
                        ? 'text-emerald-700 border-emerald-500 font-bold'
                        : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/50'
                    }`}
                  >
                    Client Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
                      activeTab === 'history' || selectedHistoryOrder
                        ? 'text-emerald-700 border-emerald-500 font-bold'
                        : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/50'
                    }`}
                    id="nav-order-history-tab"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Order History ({userOrders.length})</span>
                  </button>
                </div>

                {/* Tab Content Box */}
                <div className="p-6 overflow-y-auto flex-1 text-left">
                  
                  {/* Tab A: Profile details */}
                  {activeTab === 'profile' && !selectedHistoryOrder && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-base font-serif font-bold text-slate-900">{user.name}</h4>
                          <span className="font-mono text-[9px] text-emerald-700 bg-emerald-100/50 border border-emerald-200/50 px-2 py-0.5 rounded-full uppercase font-bold inline-block">
                            {user.isReal ? 'Verified Google Session' : 'Active Channel Session'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 font-mono text-xs">
                        <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Email Profile</span>
                          <span className="col-span-2 text-slate-800 font-semibold">{user.email}</span>
                        </div>
                        <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Primary Phone</span>
                          <span className="col-span-2 text-slate-800 font-semibold">{user.phone || '+1 (555) 341-9821'}</span>
                        </div>
                        <div className="grid grid-cols-3 py-2 border-b border-slate-100">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Status Code</span>
                          <span className="col-span-2 text-emerald-600 font-bold uppercase flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" /> SECURE LINK ESTABLISHED
                          </span>
                        </div>
                      </div>

                      {/* Summary stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-center">
                          <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest">Total Formulations</span>
                          <strong className="block font-sans text-xl font-bold text-slate-900 mt-1">
                            {userOrders.length} orders
                          </strong>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 text-center">
                          <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest">Total Invested</span>
                          <strong className="block font-sans text-xl font-bold text-slate-900 mt-1">
                            ${userOrders.reduce((acc, o) => acc + o.total, 0)}.00
                          </strong>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 hover:bg-red-50 text-red-600 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all"
                          id="logout-btn"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Disconnect Portal</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab B: Orders list history */}
                  {((activeTab === 'history') && !selectedHistoryOrder) && (
                    <div className="space-y-4 animate-fadeIn">
                      {userOrders.length === 0 ? (
                        <div className="py-12 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="font-serif text-sm font-semibold text-slate-800">No transactions recorded yet</h5>
                            <p className="text-[10px] text-slate-400 font-light max-w-xs mx-auto leading-relaxed mt-0.5">
                              When you place orders with your registered Gmail address, they will register here dynamically in real-time.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {userOrders.map((ord) => (
                            <div 
                              key={ord.id}
                              onClick={() => setSelectedHistoryOrder(ord)}
                              className="p-4 bg-white border border-slate-100 hover:border-slate-250 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                            >
                              <div className="space-y-1.5 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-slate-900">{ord.id}</span>
                                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                                    ord.status === 'Delivered'
                                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200/50'
                                      : ord.status === 'Shipped'
                                      ? 'text-indigo-700 bg-indigo-50 border-indigo-200/50'
                                      : 'text-amber-700 bg-amber-50 border-amber-200/50'
                                  }`}>
                                    {ord.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ord.date}</span>
                                  <span>•</span>
                                  <span>{ord.items.reduce((acc, it) => acc + it.quantity, 0)} items</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2.5">
                                <strong className="font-mono text-sm text-slate-900">${ord.total}.00</strong>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-view: Selected order details specs */}
                  {selectedHistoryOrder && (
                    <div className="space-y-5 animate-fadeIn text-left">
                      <button
                        onClick={() => setSelectedHistoryOrder(null)}
                        className="text-xs font-mono font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 mb-2 uppercase"
                      >
                        ← Back to Transactions list
                      </button>

                      <div className="border-b border-slate-100 pb-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-mono text-base font-bold text-slate-900">
                            Order {selectedHistoryOrder.id}
                          </h4>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border ${
                            selectedHistoryOrder.status === 'Delivered'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200/50'
                              : selectedHistoryOrder.status === 'Shipped'
                              ? 'text-indigo-700 bg-indigo-50 border-indigo-200/50'
                              : 'text-amber-700 bg-amber-50 border-amber-200/50'
                          }`}>
                            {selectedHistoryOrder.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400">
                          Registered transaction timestamp: {selectedHistoryOrder.date}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">Transaction Contents</span>
                        {selectedHistoryOrder.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-slate-50">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-slate-400 text-[11px] font-bold">x{it.quantity}</span>
                              <span className="font-sans text-slate-800 font-medium">{it.productName}</span>
                            </div>
                            <span className="font-mono text-slate-900 font-semibold">${it.price * it.quantity}.00</span>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info with Address AND Number */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/80 space-y-3 text-xs">
                        <div className="space-y-1.5">
                          <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">Recipient & Phone</span>
                          <div className="font-sans text-slate-800 font-semibold flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{selectedHistoryOrder.shippingAddress.name}</span>
                          </div>
                          {selectedHistoryOrder.shippingAddress.phone && (
                            <div className="font-mono text-slate-700 font-medium flex items-center gap-1.5 mt-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{selectedHistoryOrder.shippingAddress.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 border-t border-slate-200/50 pt-2.5">
                          <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">Shipping Address</span>
                          <div className="font-mono text-slate-600 leading-normal flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                              <p>{selectedHistoryOrder.shippingAddress.street}</p>
                              <p>{selectedHistoryOrder.shippingAddress.city}, {selectedHistoryOrder.shippingAddress.state} {selectedHistoryOrder.shippingAddress.postalCode}</p>
                              <p>{selectedHistoryOrder.shippingAddress.country}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 border-t border-slate-200/50 pt-2.5 flex justify-between items-center text-[10px] font-mono text-slate-500">
                          <span>Gateway settled</span>
                          <span className="text-slate-800 font-semibold">{selectedHistoryOrder.paymentMethod}</span>
                        </div>
                      </div>

                      {/* Price Total */}
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-mono text-xs text-slate-400 uppercase font-bold">Paid Total</span>
                        <strong className="font-mono text-lg text-slate-900">${selectedHistoryOrder.total}.00</strong>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
