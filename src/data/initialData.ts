import { Product, Order, Customer } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sian-cp-01',
    name: 'Copper Peptide Bio-Active Serum',
    price: 98,
    originalPrice: 130,
    shortDescription: 'Advanced cellular repair serum formulated with 1.5% pure blue copper peptides to restore skin elasticity and smooth fine lines.',
    description: 'SianLab’s signature formula harnesses the power of high-purity GHK-Cu (Blue Copper Peptides) synthesized in our Shanghai biotechnology lab. This ultra-fresh, clinical-grade serum accelerates dermal repair, boosts collagen synthesis, and targets micro-wrinkles. Accompanied by Oligopeptide-1, it delivers the ultimate "glass-skin" clarity and bounce.',
    ingredients: [
      'GHK-Cu (Copper Tripeptide-1)',
      'Oligopeptide-1 (EGF)',
      'Sodium Hyaluronate Crosspolymer',
      'Panthenol (Vitamin B5)',
      'Centella Asiatica Leaf Extract',
      'Deionized Water',
      'Ethylhexylglycerin'
    ],
    keyActive: '1.5% Pure GHK-Cu & Dual EGF Matrix',
    usage: 'After cleansing, apply 3–4 drops onto face and neck. Gently press with warm palms until fully absorbed. Use morning and night. Avoid using in the same routine as direct acids or Vitamin C.',
    category: 'Serums & Essences',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 148,
    stock: 42,
    tags: ['Authentic Sourced', 'Lab Tested', 'Best Seller']
  },
  {
    id: 'sian-bg-02',
    name: 'Fermented Black Ginseng Cell Cream',
    price: 125,
    originalPrice: 165,
    shortDescription: 'An ultra-rich revitalizing barrier cream infused with double-fermented Changbai Mountain black ginseng stems.',
    description: 'Enriched with cellular extracts of premium Changbai Mountain ginseng, undergone a specialized 9-cycle steam-and-ferment process. This luxurious, clinical cream deeply nourishes depleted skin barriers, restores lost lipids, and boosts cellular vitality. Paired with bio-ceramides, it forms a protective, breathable veil with a satin, semi-matte finish.',
    ingredients: [
      'Fermented Panax Ginseng Root Extract (62%)',
      'Ceramide NP / Ceramide AP / Ceramide EOP',
      'Squalane (Olive Derived)',
      'Niacinamide (Vitamin B3)',
      'Adenosine',
      'Astragalus Membranaceus Extract',
      'Shea Butter'
    ],
    keyActive: '62% Fermented Black Ginseng & Triple Ceramides',
    usage: 'Warm a pearl-sized amount between fingertips to activate. Press gently into the skin as the final step of your evening ritual, or before SPF in the morning.',
    category: 'Moisturizers & Balms',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 96,
    stock: 28,
    tags: ['Authentic Sourced', 'Clinical Grade', 'Award Winner']
  },
  {
    id: 'sian-wj-03',
    name: 'Imperial White Jade Resurfacing Essence',
    price: 78,
    shortDescription: 'Micro-peeling essence blending imperial white jade extract with 4% Gluconolactone (PHA) for gentle radiance.',
    description: 'Recreate the ancient imperial court glow. Formulated with micro-milled Nephrite Jade powder extracts to promote microcirculation, combined with second-generation PHA (Gluconolactone). This skin-refining toner essence sweepingly clears dullness and unclogs pores without irritation, revealing a translucent, polished skin texture.',
    ingredients: [
      'Nephrite (White Jade) Extract',
      'Gluconolactone (4% PHA)',
      'Saccharomyces Ferment Filtrate',
      'Licorice Root (Glycyrrhiza Glabra) Extract',
      'Allantoin',
      'Dipotassium Glycyrrhizate'
    ],
    keyActive: 'Nephrite Jade Cellular Fluid & 4% PHA',
    usage: 'Pour 3 drops onto hands or a cotton pad and sweep gently across a clean, dry face. Do not rinse. Follow with your favorite SianLab serum.',
    category: 'Serums & Essences',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 82,
    stock: 55,
    tags: ['Lab Tested', 'Gentle Peeling']
  },
  {
    id: 'sian-sm-04',
    name: 'Snow Mushroom Hydra-Luminous Gel',
    price: 52,
    originalPrice: 68,
    shortDescription: 'Ultra-lightweight hydrating gel containing organic Tremella Fuciformis (Snow Mushroom) polysaccharides.',
    description: 'A clinical hydrating gel that outperforms traditional hyaluronic acid. Harnessing Tremella Fuciformis, a snow mushroom that holds up to 500x its weight in water, this gel instantly bursts into a watery infusion upon application. It delivers weightless hydration, soothes hot flushed skin, and locks in a dewy, non-sticky clinical sheen.',
    ingredients: [
      'Tremella Fuciformis (Mushroom) Extract (75%)',
      'Panthenol (Pro-Vitamin B5)',
      'Beta-Glucan',
      'Aloe Barbadensis Leaf Juice',
      'Cucumber Fruit Extract',
      'Glycerin'
    ],
    keyActive: '75% Active Tremella Polysaccharides',
    usage: 'Apply generously to face and neck as a lightweight moisturizer. Can also be layered thickly as an overnight sleeping mask or emergency 10-minute soothing compress.',
    category: 'Moisturizers & Balms',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 214,
    stock: 64,
    tags: ['Best Seller', 'Lab Tested', 'Weightless']
  },
  {
    id: 'sian-as-05',
    name: 'Astragalus Defense Barrier Balm',
    price: 68,
    shortDescription: 'Concentrated protective balm with Astragalus root extracts to repair wind-burned and compromised skin.',
    description: 'SianLab’s defensive balm is a lifesaver for irritated, sensitized, or barrier-compromised skin. Blending clinical Astragalus Membranaceus root extract—renowned for its anti-inflammatory and cellular defensive properties—with pure madecassoside and physical skin-identical lipids. It calms dry patches and red blemishes instantly.',
    ingredients: [
      'Astragalus Membranaceus Root Extract (30%)',
      'Madecassoside (95% Purity)',
      'Phytosterols',
      'Squalane',
      'Tocopheryl Acetate (Vitamin E)',
      'Camellia Sinensis Leaf Extract'
    ],
    keyActive: '30% Astragalus Membrane Extract & Madecassoside',
    usage: 'Squeeze a small amount and warm in hands. Press onto dry, flaky, or red areas of concern. Ideal for post-treatment skin or harsh, cold climates.',
    category: 'Moisturizers & Balms',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewsCount: 51,
    stock: 19,
    tags: ['Authentic Sourced', 'Barrier Repair']
  },
  {
    id: 'sian-cy-06',
    name: 'Cordyceps Youth Active Eye Concentré',
    price: 88,
    originalPrice: 110,
    shortDescription: 'Advanced bio-energy eye cream formulated with Cordyceps Sinensis mycelium to lift and de-puff.',
    description: 'Target fatigue and shadow circles under the eyes with SianLab’s bio-energy cream. Utilizing micro-encapsulated Cordyceps Sinensis extract and marine collagen peptides, this rich fluid acts as a mitochondrial catalyst to re-energize the delicate eye contour, visually lifting saggy eyelids and reducing vascular dark circles.',
    ingredients: [
      'Cordyceps Sinensis Extract',
      'Soluble Collagen',
      'Caffeine (3%)',
      'Acetyl Tetrapeptide-5',
      'N-Hydroxysuccinimide',
      'Sweet Almond Oil'
    ],
    keyActive: 'Encapsulated Cordyceps Mycelium & 3% Caffeine',
    usage: 'Dispense half a pump onto ring fingers. Smooth gently around the entire eye area, tapping in a circular motion. Use morning and evening.',
    category: 'Specialized Treatments',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 73,
    stock: 33,
    tags: ['Lab Tested', 'Clinical Grade']
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-01',
    name: 'Eleanor Vance',
    email: 'eleanor.v@clinicalskin.com',
    phone: '+1 (555) 019-2834',
    joinDate: '2026-02-12',
    totalSpent: 418,
    orderCount: 3,
    orders: [
      { orderId: 'SL-8842', date: '2026-06-15', total: 176, status: 'Delivered' },
      { orderId: 'SL-8512', date: '2026-04-02', total: 125, status: 'Delivered' },
      { orderId: 'SL-8199', date: '2026-02-14', total: 117, status: 'Delivered' }
    ]
  },
  {
    id: 'c-02',
    name: 'Dr. Marcus Thorne',
    email: 'm.thorne@dermatologylab.org',
    phone: '+1 (555) 014-9981',
    joinDate: '2026-03-20',
    totalSpent: 622,
    orderCount: 4,
    orders: [
      { orderId: 'SL-9012', date: '2026-07-01', total: 294, status: 'Shipped' },
      { orderId: 'SL-8732', date: '2026-05-18', total: 125, status: 'Delivered' },
      { orderId: 'SL-8421', date: '2026-04-10', total: 125, status: 'Delivered' },
      { orderId: 'SL-8302', date: '2026-03-21', total: 78, status: 'Delivered' }
    ]
  },
  {
    id: 'c-03',
    name: 'Xue Chen',
    email: 'chen.xue@yangtzecapital.cn',
    phone: '+86 138-0199-8822',
    joinDate: '2026-01-05',
    totalSpent: 850,
    orderCount: 5,
    orders: [
      { orderId: 'SL-9104', date: '2026-07-02', total: 196, status: 'Pending' },
      { orderId: 'SL-8902', date: '2026-06-20', total: 226, status: 'Delivered' },
      { orderId: 'SL-8622', date: '2026-05-01', total: 156, status: 'Delivered' },
      { orderId: 'SL-8401', date: '2026-03-12', total: 140, status: 'Delivered' },
      { orderId: 'SL-8101', date: '2026-01-10', total: 132, status: 'Delivered' }
    ]
  },
  {
    id: 'c-04',
    name: 'Sophia Lorenzi',
    email: 'sophia@luxeaesthetic.it',
    phone: '+39 342-990-2184',
    joinDate: '2026-05-22',
    totalSpent: 125,
    orderCount: 1,
    orders: [
      { orderId: 'SL-8799', date: '2026-05-23', total: 125, status: 'Delivered' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SL-9104',
    customerName: 'Xue Chen',
    customerEmail: 'chen.xue@yangtzecapital.cn',
    items: [
      {
        productId: 'sian-cp-01',
        productName: 'Copper Peptide Bio-Active Serum',
        price: 98,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
      }
    ],
    total: 196,
    date: '2026-07-02',
    status: 'Pending',
    shippingAddress: {
      name: 'Xue Chen',
      street: '158 Fuxing Middle Road, Apt 4C',
      city: 'Shanghai',
      state: 'Shanghai',
      postalCode: '200021',
      country: 'China'
    },
    paymentMethod: 'Alipay / Credit Card'
  },
  {
    id: 'SL-9012',
    customerName: 'Dr. Marcus Thorne',
    customerEmail: 'm.thorne@dermatologylab.org',
    items: [
      {
        productId: 'sian-bg-02',
        productName: 'Fermented Black Ginseng Cell Cream',
        price: 125,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=800'
      },
      {
        productId: 'sian-wj-03',
        productName: 'Imperial White Jade Resurfacing Essence',
        price: 78,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
      },
      {
        productId: 'sian-sm-04',
        productName: 'Snow Mushroom Hydra-Luminous Gel',
        price: 52,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800'
      }
    ],
    total: 255, // 125 + 78 + 52
    date: '2026-07-01',
    status: 'Shipped',
    shippingAddress: {
      name: 'Marcus Thorne',
      street: '82 Harvard Scientific Ave',
      city: 'Cambridge',
      state: 'MA',
      postalCode: '02138',
      country: 'United States'
    },
    paymentMethod: 'VisaEnding 4981'
  },
  {
    id: 'SL-8842',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.v@clinicalskin.com',
    items: [
      {
        productId: 'sian-cp-01',
        productName: 'Copper Peptide Bio-Active Serum',
        price: 98,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
      },
      {
        productId: 'sian-wj-03',
        productName: 'Imperial White Jade Resurfacing Essence',
        price: 78,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
      }
    ],
    total: 176,
    date: '2026-06-15',
    status: 'Delivered',
    shippingAddress: {
      name: 'Eleanor Vance',
      street: '404 Oakwood Heights Dr',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98109',
      country: 'United States'
    },
    paymentMethod: 'Mastercard Ending 8832'
  },
  {
    id: 'SL-8799',
    customerName: 'Sophia Lorenzi',
    customerEmail: 'sophia@luxeaesthetic.it',
    items: [
      {
        productId: 'sian-bg-02',
        productName: 'Fermented Black Ginseng Cell Cream',
        price: 125,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=800'
      }
    ],
    total: 125,
    date: '2026-05-23',
    status: 'Delivered',
    shippingAddress: {
      name: 'Sophia Lorenzi',
      street: 'Via della Spiga, 12',
      city: 'Milano',
      state: 'Lombardia',
      postalCode: '20121',
      country: 'Italy'
    },
    paymentMethod: 'Apple Pay'
  }
];

export const SALES_HISTORY = [
  { month: 'Jan', sales: 12400, orders: 110 },
  { month: 'Feb', sales: 18900, orders: 154 },
  { month: 'Mar', sales: 15300, orders: 130 },
  { month: 'Apr', sales: 22400, orders: 198 },
  { month: 'May', sales: 29100, orders: 245 },
  { month: 'Jun', sales: 34500, orders: 290 },
  { month: 'Jul (Est)', sales: 42000, orders: 340 }
];
