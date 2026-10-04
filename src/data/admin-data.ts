// Types for luxury Admin CRM system
export type AdminOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type AdminPaymentMethod = "bkash" | "nagad" | "card" | "cod";
export type AdminPaymentStatus = "paid" | "unpaid" | "refunded";
export type AdminCustomerTier = "VIP Patron" | "Gold Member" | "Silver Member" | "First-Time";

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  totalOrders: number;
  lifetimeSpend: number;
  tier: AdminCustomerTier;
  avatar: string;
  joinedDate: string;
  lastActive: string;
  status: "active" | "inactive";
}

export interface AdminOrderItem {
  productId: string;
  title: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OrderTimelineEvent {
  title: string;
  time: string;
  done: boolean;
  note?: string;
}

export interface AdminOrder {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    tier: AdminCustomerTier;
  };
  items: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: AdminPaymentMethod;
  paymentStatus: AdminPaymentStatus;
  transactionId?: string;
  orderStatus: AdminOrderStatus;
  createdAt: string;
  shippingAddress: string;
  shippingCity: string;
  courier: string;
  trackingCode?: string;
  estimatedDelivery?: string;
  timeline: OrderTimelineEvent[];
  notes?: string;
}

export interface KPIMetric {
  label: string;
  value: string;
  rawNumeric?: number;
  trend: string;
  isPositive: boolean;
  description: string;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryShare {
  name: string;
  revenue: number;
  percentage: number;
  color: string;
}

// Global luxury enterprise KPI summaries
export const KPI_METRICS: KPIMetric[] = [
  {
    label: "Total Gross Revenue",
    value: "৳2,845,900",
    rawNumeric: 2845900,
    trend: "+18.4%",
    isPositive: true,
    description: "vs. previous 30 days",
  },
  {
    label: "Order Volume",
    value: "1,284",
    rawNumeric: 1284,
    trend: "+12.6%",
    isPositive: true,
    description: "38 orders pending dispatch",
  },
  {
    label: "Active VIP Patrons",
    value: "942",
    rawNumeric: 942,
    trend: "+8.1%",
    isPositive: true,
    description: "74% repeat purchase rate",
  },
  {
    label: "On-Time Dispatch Rate",
    value: "99.2%",
    rawNumeric: 99.2,
    trend: "+1.4%",
    isPositive: true,
    description: "Avg. fulfillment < 24 hrs",
  },
];

// Revenue trend dataset (30 days aggregated weekly / key points)
export const REVENUE_TREND_DATA: RevenuePoint[] = [
  { date: "Sep 05", revenue: 58000, orders: 24 },
  { date: "Sep 10", revenue: 72400, orders: 31 },
  { date: "Sep 15", revenue: 94500, orders: 42 },
  { date: "Sep 20", revenue: 86000, orders: 38 },
  { date: "Sep 25", revenue: 112000, orders: 51 },
  { date: "Sep 30", revenue: 128900, orders: 58 },
  { date: "Oct 01", revenue: 145000, orders: 66 },
  { date: "Oct 02", revenue: 139200, orders: 62 },
  { date: "Oct 03", revenue: 168400, orders: 74 },
  { date: "Oct 04", revenue: 182500, orders: 81 },
];

// Department category performance
export const CATEGORY_PERFORMANCE: CategoryShare[] = [
  { name: "Luxury Fashion", revenue: 1195000, percentage: 42, color: "#18181B" },
  { name: "Hijab & Modest Wear", revenue: 796000, percentage: 28, color: "#4F46E5" },
  { name: "Beauty & Fragrance", revenue: 455000, percentage: 16, color: "#EC4899" },
  { name: "Fine Accessories", revenue: 399900, percentage: 14, color: "#10B981" },
];

// Bangladeshi customer CRM database
export const MOCK_CUSTOMERS: AdminCustomer[] = [
  {
    id: "CUST-001",
    name: "Tahmid Rahman",
    email: "tahmid.rahman@dhakafinance.com",
    phone: "+880 1711-892401",
    city: "Dhaka",
    address: "House 42, Road 11, Block D, Banani, Dhaka-1213",
    totalOrders: 18,
    lifetimeSpend: 84600,
    tier: "VIP Patron",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2025-04-12",
    lastActive: "15 mins ago",
    status: "active",
  },
  {
    id: "CUST-002",
    name: "Nusrat Jahan Chowdhury",
    email: "nusrat.jahan@ctgport.net",
    phone: "+880 1819-304912",
    city: "Chittagong",
    address: "Bungalow 7, Nasirabad Housing Society, Chittagong",
    totalOrders: 12,
    lifetimeSpend: 56400,
    tier: "VIP Patron",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2025-06-20",
    lastActive: "1 hour ago",
    status: "active",
  },
  {
    id: "CUST-003",
    name: "Dr. Sabrina Farhana",
    email: "sabrina.farhana@apollo-hospital.org",
    phone: "+880 1713-994420",
    city: "Dhaka",
    address: "Apartment 5B, Gulshan Lake View, Road 71, Gulshan-2, Dhaka",
    totalOrders: 9,
    lifetimeSpend: 42100,
    tier: "Gold Member",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2025-08-01",
    lastActive: "3 hours ago",
    status: "active",
  },
  {
    id: "CUST-004",
    name: "Tanvir Ahmed",
    email: "tanvir.ahmed@sylhet-tea.com",
    phone: "+880 1912-774011",
    city: "Sylhet",
    address: "Villa Jasmine, Shahjalal Uposhohor, Block B, Sylhet",
    totalOrders: 6,
    lifetimeSpend: 28900,
    tier: "Gold Member",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2025-10-15",
    lastActive: "Yesterday",
    status: "active",
  },
  {
    id: "CUST-005",
    name: "Samira Khan",
    email: "samira.khan@dhanmondi-design.io",
    phone: "+880 1618-294018",
    city: "Dhaka",
    address: "House 18, Road 27 (Old), Dhanmondi R/A, Dhaka-1209",
    totalOrders: 4,
    lifetimeSpend: 19800,
    tier: "Silver Member",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2026-01-10",
    lastActive: "2 days ago",
    status: "active",
  },
  {
    id: "CUST-006",
    name: "Engr. Mahtab Uddin",
    email: "mahtab.uddin@brac-tech.com",
    phone: "+880 1715-442190",
    city: "Dhaka",
    address: "Sector 7, Road 13, Uttara Model Town, Dhaka-1230",
    totalOrders: 5,
    lifetimeSpend: 23400,
    tier: "Silver Member",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2026-02-18",
    lastActive: "5 hours ago",
    status: "active",
  },
  {
    id: "CUST-007",
    name: "Afsana Mimi",
    email: "afsana.mimi@panchlaish.com",
    phone: "+880 1822-661902",
    city: "Chittagong",
    address: "Road 3, O.R. Nizam Road R/A, Panchlaish, Chittagong",
    totalOrders: 1,
    lifetimeSpend: 5450,
    tier: "First-Time",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2026-10-02",
    lastActive: "Today",
    status: "active",
  },
  {
    id: "CUST-008",
    name: "Sadman Sakib",
    email: "sadman.sakib@mirpur-dohs.net",
    phone: "+880 1799-812033",
    city: "Dhaka",
    address: "Road 9, Avenue 4, Mirpur DOHS, Dhaka",
    totalOrders: 2,
    lifetimeSpend: 8900,
    tier: "Silver Member",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
    joinedDate: "2026-08-14",
    lastActive: "Yesterday",
    status: "active",
  },
];

// Rich Bangladeshi CRM order records
export const MOCK_ORDERS: AdminOrder[] = [
  {
    id: "ORD-9281",
    customer: {
      id: "CUST-001",
      name: "Tahmid Rahman",
      email: "tahmid.rahman@dhakafinance.com",
      phone: "+880 1711-892401",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      tier: "VIP Patron",
    },
    items: [
      {
        productId: "prod-1",
        title: "Tailored Virgin Wool Blazer",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
        category: "Fashion",
        price: 3450,
        quantity: 1,
        size: "L",
        color: "Obsidian",
      },
      {
        productId: "prod-3",
        title: "Minimalist Cashmere Crewneck",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop",
        category: "Fashion",
        price: 2150,
        quantity: 1,
        size: "L",
        color: "Bone White",
      },
    ],
    subtotal: 5600,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 5600,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    transactionId: "BK-9X4810294",
    orderStatus: "processing",
    createdAt: "2026-10-04 11:45 AM",
    shippingAddress: "House 42, Road 11, Block D, Banani, Dhaka-1213",
    shippingCity: "Dhaka",
    courier: "In-House",
    trackingCode: "INSP-VIP-8812",
    estimatedDelivery: "2026-10-05 Evening",
    timeline: [
      { title: "Order Placed", time: "11:45 AM", done: true, note: "Online verification passed" },
      { title: "Payment Confirmed via bKash", time: "11:46 AM", done: true, note: "Txn ID: BK-9X4810294" },
      { title: "Atelier Quality Inspection", time: "12:15 PM", done: true, note: "Garments hand pressed" },
      { title: "Packaging & Fragrance Seal", time: "Pending", done: false },
      { title: "VIP Concierge Out for Delivery", time: "Pending", done: false },
    ],
    notes: "VIP Patron. Fragrance packaging with signature cedarwood tissue requested.",
  },
  {
    id: "ORD-9280",
    customer: {
      id: "CUST-002",
      name: "Nusrat Jahan Chowdhury",
      email: "nusrat.jahan@ctgport.net",
      phone: "+880 1819-304912",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
      tier: "VIP Patron",
    },
    items: [
      {
        productId: "prod-2",
        title: "Double-Faced Wool Coat",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop",
        category: "Fashion",
        price: 4200,
        quantity: 1,
        size: "M",
        color: "Camel",
      },
      {
        productId: "prod-11",
        title: "Mulberry Silk Luxury Hijab",
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900&auto=format&fit=crop",
        category: "Hijab",
        price: 1850,
        quantity: 2,
        color: "Champagne Pearl",
      },
    ],
    subtotal: 7900,
    deliveryFee: 120,
    discount: 500,
    totalAmount: 7520,
    paymentMethod: "card",
    paymentStatus: "paid",
    transactionId: "VISA-40291-AUTH",
    orderStatus: "shipped",
    createdAt: "2026-10-04 09:12 AM",
    shippingAddress: "Bungalow 7, Nasirabad Housing Society, Chittagong",
    shippingCity: "Chittagong",
    courier: "Pathao Express Priority",
    trackingCode: "PTH-CTG-99410",
    estimatedDelivery: "2026-10-06 Morning",
    timeline: [
      { title: "Order Placed", time: "09:12 AM", done: true },
      { title: "Payment Cleared (City Bank Amex)", time: "09:13 AM", done: true },
      { title: "Picked & Packed", time: "10:30 AM", done: true },
      { title: "Handed over to Pathao Express", time: "11:45 AM", done: true, note: "Tracking: PTH-CTG-99410" },
      { title: "Delivered to Chittagong Hub", time: "In Transit", done: false },
    ],
    notes: "Call before doorstep arrival.",
  },
  {
    id: "ORD-9279",
    customer: {
      id: "CUST-003",
      name: "Dr. Sabrina Farhana",
      email: "sabrina.farhana@apollo-hospital.org",
      phone: "+880 1713-994420",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
      tier: "Gold Member",
    },
    items: [
      {
        productId: "prod-22",
        title: "Oud Royale Extrait de Parfum",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=900&auto=format&fit=crop",
        category: "Beauty",
        price: 4950,
        quantity: 1,
      },
    ],
    subtotal: 4950,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 4950,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    transactionId: "BK-8820491A",
    orderStatus: "delivered",
    createdAt: "2026-10-03 04:30 PM",
    shippingAddress: "Apartment 5B, Gulshan Lake View, Road 71, Gulshan-2, Dhaka",
    shippingCity: "Dhaka",
    courier: "In-House",
    trackingCode: "INSP-CON-1092",
    estimatedDelivery: "2026-10-04 10:00 AM",
    timeline: [
      { title: "Order Placed", time: "04:30 PM", done: true },
      { title: "bKash Payment Verified", time: "04:31 PM", done: true },
      { title: "Inspected & Packed", time: "05:15 PM", done: true },
      { title: "Out for Delivery", time: "09:30 AM", done: true },
      { title: "Successfully Delivered", time: "10:15 AM", done: true, note: "Received by Dr. Sabrina" },
    ],
    notes: "Deliver after 9:30 AM before hospital shift.",
  },
  {
    id: "ORD-9278",
    customer: {
      id: "CUST-004",
      name: "Tanvir Ahmed",
      email: "tanvir.ahmed@sylhet-tea.com",
      phone: "+880 1912-774011",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      tier: "Gold Member",
    },
    items: [
      {
        productId: "prod-31",
        title: "Italian Calfskin Heritage Belt",
        image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=900&auto=format&fit=crop",
        category: "Accessories",
        price: 2450,
        quantity: 1,
        size: "34",
        color: "Espresso",
      },
    ],
    subtotal: 2450,
    deliveryFee: 130,
    discount: 0,
    totalAmount: 2580,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "shipped",
    createdAt: "2026-10-03 01:20 PM",
    shippingAddress: "Villa Jasmine, Shahjalal Uposhohor, Block B, Sylhet",
    shippingCity: "Sylhet",
    courier: "SteadFast Courier",
    trackingCode: "STF-SYL-40912",
    estimatedDelivery: "2026-10-05 Afternoon",
    timeline: [
      { title: "Order Placed (Cash on Delivery)", time: "01:20 PM", done: true },
      { title: "Phone Confirmation Verified", time: "01:40 PM", done: true },
      { title: "Dispatched via SteadFast", time: "04:00 PM", done: true, note: "Tracking: STF-SYL-40912" },
      { title: "Hub Arrival Sylhet", time: "In Transit", done: false },
    ],
    notes: "Collect ৳2,580 exact cash upon handover.",
  },
  {
    id: "ORD-9277",
    customer: {
      id: "CUST-005",
      name: "Samira Khan",
      email: "samira.khan@dhanmondi-design.io",
      phone: "+880 1618-294018",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
      tier: "Silver Member",
    },
    items: [
      {
        productId: "prod-13",
        title: "Pleated Georgette Modest Abaya",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
        category: "Hijab",
        price: 3600,
        quantity: 1,
        size: "54",
        color: "Midnight Navy",
      },
    ],
    subtotal: 3600,
    deliveryFee: 60,
    discount: 0,
    totalAmount: 3660,
    paymentMethod: "nagad",
    paymentStatus: "paid",
    transactionId: "NGD-7730198",
    orderStatus: "pending",
    createdAt: "2026-10-04 12:10 PM",
    shippingAddress: "House 18, Road 27 (Old), Dhanmondi R/A, Dhaka-1209",
    shippingCity: "Dhaka",
    courier: "RedX Priority",
    estimatedDelivery: "2026-10-05",
    timeline: [
      { title: "Order Placed", time: "12:10 PM", done: true },
      { title: "Nagad Payment Confirmed", time: "12:11 PM", done: true },
      { title: "Awaiting Dispatch Packing", time: "Current", done: false },
    ],
    notes: "Requires quick delivery for weekend event.",
  },
  {
    id: "ORD-9276",
    customer: {
      id: "CUST-006",
      name: "Engr. Mahtab Uddin",
      email: "mahtab.uddin@brac-tech.com",
      phone: "+880 1715-442190",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      tier: "Silver Member",
    },
    items: [
      {
        productId: "prod-32",
        title: "Minimalist Chrono Steel Watch",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
        category: "Accessories",
        price: 5800,
        quantity: 1,
      },
    ],
    subtotal: 5800,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 5800,
    paymentMethod: "card",
    paymentStatus: "paid",
    transactionId: "MASTERCARD-9912",
    orderStatus: "delivered",
    createdAt: "2026-10-02 02:40 PM",
    shippingAddress: "Sector 7, Road 13, Uttara Model Town, Dhaka-1230",
    shippingCity: "Dhaka",
    courier: "Pathao Express",
    trackingCode: "PTH-UTT-55109",
    estimatedDelivery: "2026-10-03 01:00 PM",
    timeline: [
      { title: "Order Placed", time: "02:40 PM", done: true },
      { title: "Card Authorization Completed", time: "02:41 PM", done: true },
      { title: "Dispatched from Hub", time: "05:00 PM", done: true },
      { title: "Delivered to Customer", time: "01:25 PM", done: true },
    ],
    notes: "Customer signed acknowledgement slip.",
  },
  {
    id: "ORD-9275",
    customer: {
      id: "CUST-007",
      name: "Afsana Mimi",
      email: "afsana.mimi@panchlaish.com",
      phone: "+880 1822-661902",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
      tier: "First-Time",
    },
    items: [
      {
        productId: "prod-1",
        title: "Tailored Virgin Wool Blazer",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
        category: "Fashion",
        price: 3450,
        quantity: 1,
        size: "S",
      },
    ],
    subtotal: 3450,
    deliveryFee: 120,
    discount: 0,
    totalAmount: 3570,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    transactionId: "BK-4410982X",
    orderStatus: "pending",
    createdAt: "2026-10-04 12:28 PM",
    shippingAddress: "Road 3, O.R. Nizam Road R/A, Panchlaish, Chittagong",
    shippingCity: "Chittagong",
    courier: "Pathao Express",
    estimatedDelivery: "2026-10-07",
    timeline: [
      { title: "Order Placed", time: "12:28 PM", done: true },
      { title: "bKash Received", time: "12:29 PM", done: true },
      { title: "Processing in Queue", time: "Current", done: false },
    ],
    notes: "First time customer, provide brand welcome catalog.",
  },
  {
    id: "ORD-9274",
    customer: {
      id: "CUST-008",
      name: "Sadman Sakib",
      email: "sadman.sakib@mirpur-dohs.net",
      phone: "+880 1799-812033",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
      tier: "Silver Member",
    },
    items: [
      {
        productId: "prod-3",
        title: "Minimalist Cashmere Crewneck",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop",
        category: "Fashion",
        price: 2150,
        quantity: 1,
        size: "M",
      },
    ],
    subtotal: 2150,
    deliveryFee: 60,
    discount: 0,
    totalAmount: 2210,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "cancelled",
    createdAt: "2026-10-03 08:00 AM",
    shippingAddress: "Road 9, Avenue 4, Mirpur DOHS, Dhaka",
    shippingCity: "Dhaka",
    courier: "RedX Priority",
    timeline: [
      { title: "Order Placed", time: "08:00 AM", done: true },
      { title: "Customer Requested Size Adjustment", time: "09:15 AM", done: true },
      { title: "Cancelled per Customer Request", time: "09:30 AM", done: true, note: "Replaced with ORD-9281" },
    ],
    notes: "Customer cancelled to re-order in size L.",
  },
];
