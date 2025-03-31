export interface BookDetails {
  _id: string;
  images: string[];
  title: string;
  category: string;
  condition: string;
  classType: string;
  subject: string;
  price: number;
  author: string;
  edition: string;
  description: string;
  finalPrice: number;
  shippingCharge: string | number;
  paymentMode: 'UPI' | 'Bank Account';
  paymentDetails: {
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
  };
  createdAt: Date;
  seller: UserData;
}

export interface UserData {
  name: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: string;
  keepPrivate: boolean;
  addresses?: Address[]; 
}

export interface Address {
  _id: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Product {
  _id: string;
  images: string[];
  title: string;
  price: number;
  finalPrice: number;
  shippingCharge: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: BookDetails;
  quantity: number;
}

export interface PaymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  paymentDetails: PaymentDetails;
  paymentStatus: string;
  status: string;
  createdAt: string;
  user: {
    email: string;
    name: string;
    _id: string;
  };
  totalAmount:string;
  shippingAddress: Address; 
}
