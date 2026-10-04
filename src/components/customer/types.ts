export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  sku: string;
}

export interface TrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: "processing" | "in_transit" | "delivered" | "cancelled";
  statusLabel: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Cash on Delivery" | "Refunded";
  items: OrderItem[];
  trackingSteps: TrackingStep[];
}

export interface PatronAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface PromoVoucher {
  code: string;
  discount: string;
  minSpend: string;
  expiry: string;
  description: string;
}

export interface MembershipPrivilege {
  title: string;
  description: string;
  iconName: string;
}
