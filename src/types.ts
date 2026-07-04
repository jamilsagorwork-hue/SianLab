export interface Product {
  id: string;
  name: string;
  price: number; // in USD
  originalPrice?: number;
  description: string;
  shortDescription: string;
  ingredients: string[];
  keyActive: string;
  usage: string;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalSpent: number;
  orderCount: number;
  orders: {
    orderId: string;
    date: string;
    total: number;
    status: 'Pending' | 'Shipped' | 'Delivered';
  }[];
}
