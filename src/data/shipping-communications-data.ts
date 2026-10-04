export interface CourierIntegration {
  id: string;
  name: string;
  provider: "steadfast" | "pathao" | "redx" | "ecourier" | "paperfly";
  enabled: boolean;
  apiKey: string;
  secretKey?: string;
  baseUrl: string;
  storeId?: string;
  autoConsignmentOnProcessing: boolean;
  autoSendTrackingSMS: boolean;
  webhookEnabled: boolean;
  walletBalanceBDT: number;
}

export interface ShippingZoneRate {
  id: string;
  name: string;
  regions: string;
  standardFee: number;
  expressFee?: number;
  estimatedDelivery: string;
  freeShippingThreshold: number;
  codFee: number;
  enabled: boolean;
}

export interface ConsignmentItem {
  id: string;
  trackingCode: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  courier: "Steadfast Express" | "Pathao Logistics" | "RedX Courier";
  codAmount: number;
  weightKg: number;
  status: "In Transit" | "Out for Delivery" | "Delivered" | "Returned" | "Pending Handover";
  bookedAt: string;
  estimatedDeliveryDate: string;
}

export interface SMSGatewayConfig {
  provider: "greenweb" | "mimsms" | "banglalink" | "grameenphone" | "twilio";
  apiKey: string;
  senderId: string;
  balanceSMS: number;
  autoOrderConfirmation: boolean;
  autoDispatchWithTracking: boolean;
  autoDeliveryReviewPrompt: boolean;
  orderTemplate: string;
  dispatchTemplate: string;
  otpTemplate: string;
}

export interface EmailGatewayConfig {
  provider: "gmail" | "resend" | "sendgrid" | "smtp";
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassMasked: string;
  senderName: string;
  senderEmail: string;
  enableInvoiceEmail: boolean;
  enableDispatchEmail: boolean;
  enableVipPatronWelcome: boolean;
}

export interface OTPVerificationRules {
  enabledOnCheckout: boolean;
  mandatoryForCOD: boolean;
  codThresholdBDT: number;
  otpLength: 4 | 6;
  expiryMinutes: number;
  channels: "sms" | "email" | "both";
  maxAttempts: number;
  lockoutMinutes: number;
}

export interface CommunicationLogItem {
  id: string;
  timestamp: string;
  channel: "SMS" | "Gmail SMTP" | "SMS OTP" | "Email OTP";
  recipient: string;
  recipientName: string;
  eventType: "Order Placed" | "Consignment Dispatched" | "OTP Verification" | "Delivered Alert";
  status: "Delivered" | "Sent" | "Failed" | "Verified";
  contentSnippet: string;
  gatewayResponse: string;
}

export const INITIAL_COURIER_INTEGRATIONS: CourierIntegration[] = [
  {
    id: "courier-steadfast",
    name: "Steadfast Courier Express",
    provider: "steadfast",
    enabled: true,
    apiKey: "stf_live_894729104820194820",
    secretKey: "stf_sec_••••••••••••••••••••",
    baseUrl: "https://portal.steadfast.com.bd/api/v1",
    autoConsignmentOnProcessing: true,
    autoSendTrackingSMS: true,
    webhookEnabled: true,
    walletBalanceBDT: 42500,
  },
  {
    id: "courier-pathao",
    name: "Pathao Logistics API",
    provider: "pathao",
    enabled: true,
    apiKey: "pth_client_99214051",
    secretKey: "pth_sec_••••••••••••••••••••",
    baseUrl: "https://api-hermes.pathao.com/aladdin/api/v1",
    storeId: "STORE-DHAKA-BANANI-01",
    autoConsignmentOnProcessing: false,
    autoSendTrackingSMS: true,
    webhookEnabled: true,
    walletBalanceBDT: 18200,
  },
  {
    id: "courier-redx",
    name: "RedX Logistics",
    provider: "redx",
    enabled: false,
    apiKey: "redx_live_token_771829",
    baseUrl: "https://openapi.redx.com.bd/v1.0.0-beta",
    autoConsignmentOnProcessing: false,
    autoSendTrackingSMS: false,
    webhookEnabled: false,
    walletBalanceBDT: 0,
  },
];

export const INITIAL_SHIPPING_ZONES: ShippingZoneRate[] = [
  {
    id: "zone-dhaka-metro",
    name: "Dhaka Metropolitan Area",
    regions: "Banani, Gulshan, Dhanmondi, Uttara, Mirpur, Mohakhali, Motijheel, Old Dhaka",
    standardFee: 70,
    expressFee: 150,
    estimatedDelivery: "24 – 48 Hours",
    freeShippingThreshold: 5000,
    codFee: 0,
    enabled: true,
  },
  {
    id: "zone-chittagong-sylhet",
    name: "Divisional Major Cities (Chittagong, Sylhet, Rajshahi)",
    regions: "Chittagong Sadar, Sylhet City, Rajshahi, Khulna, Barisal, Comilla",
    standardFee: 130,
    expressFee: 220,
    estimatedDelivery: "48 – 72 Hours",
    freeShippingThreshold: 7000,
    codFee: 0,
    enabled: true,
  },
  {
    id: "zone-rest-of-bd",
    name: "Rest of Bangladesh (All Upazilas & Rural Thanas)",
    regions: "All nationwide suburban and rural delivery hubs",
    standardFee: 150,
    estimatedDelivery: "72 – 96 Hours",
    freeShippingThreshold: 8000,
    codFee: 20,
    enabled: true,
  },
];

export const INITIAL_CONSIGNMENTS: ConsignmentItem[] = [
  {
    id: "cns-1",
    trackingCode: "STF-992104",
    orderId: "ORD-2026-0891",
    customerName: "Farhana Nasrin",
    customerPhone: "+880 1711-234567",
    customerAddress: "House 42, Road 11, Block D, Banani, Dhaka",
    city: "Dhaka",
    courier: "Steadfast Express",
    codAmount: 3530,
    weightKg: 0.8,
    status: "Delivered",
    bookedAt: "Oct 02, 2026 · 09:15 AM",
    estimatedDeliveryDate: "Oct 03, 2026",
  },
  {
    id: "cns-2",
    trackingCode: "PTH-881920",
    orderId: "ORD-2026-0892",
    customerName: "Tanzim Rahman",
    customerPhone: "+880 1819-876543",
    customerAddress: "Apartment 5B, Road 4, Sector 3, Uttara, Dhaka",
    city: "Dhaka",
    courier: "Pathao Logistics",
    codAmount: 0,
    weightKg: 1.2,
    status: "In Transit",
    bookedAt: "Oct 03, 2026 · 11:30 AM",
    estimatedDeliveryDate: "Oct 04, 2026",
  },
  {
    id: "cns-3",
    trackingCode: "STF-992118",
    orderId: "ORD-2026-0894",
    customerName: "Nusrat Jahan",
    customerPhone: "+880 1912-345678",
    customerAddress: "Rose Valley Villa, GEC Circle, Chittagong",
    city: "Chittagong",
    courier: "Steadfast Express",
    codAmount: 12500,
    weightKg: 2.1,
    status: "Out for Delivery",
    bookedAt: "Oct 03, 2026 · 02:45 PM",
    estimatedDeliveryDate: "Oct 04, 2026",
  },
  {
    id: "cns-4",
    trackingCode: "STF-992125",
    orderId: "ORD-2026-0895",
    customerName: "Anisur Zaman",
    customerPhone: "+880 1611-987123",
    customerAddress: "Shapla Bhaban, Zindabazar, Sylhet",
    city: "Sylhet",
    courier: "Steadfast Express",
    codAmount: 4200,
    weightKg: 0.6,
    status: "Pending Handover",
    bookedAt: "Today · 10:20 AM",
    estimatedDeliveryDate: "Oct 06, 2026",
  },
];

export const INITIAL_SMS_CONFIG: SMSGatewayConfig = {
  provider: "greenweb",
  apiKey: "gw_live_tok_991823719284710",
  senderId: "INSPIRE",
  balanceSMS: 4850,
  autoOrderConfirmation: true,
  autoDispatchWithTracking: true,
  autoDeliveryReviewPrompt: true,
  orderTemplate: "Dear {{customer_name}}, your Inspire Lifestyle order #{{order_id}} of BDT {{total_amount}} has been confirmed. Atelier team is preparing your garments.",
  dispatchTemplate: "Dear {{customer_name}}, order #{{order_id}} has been dispatched via {{courier}}. Track shipment: https://track.inspire.com/{{tracking_code}}",
  otpTemplate: "{{otp}} is your Inspire Lifestyle verification code. Valid for 2 mins. Do not share with anyone.",
};

export const INITIAL_EMAIL_CONFIG: EmailGatewayConfig = {
  provider: "gmail",
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  smtpUser: "concierge@inspirelifestyle.com",
  smtpPassMasked: "•••• •••• •••• ••••",
  senderName: "Inspire Lifestyle Atelier",
  senderEmail: "concierge@inspirelifestyle.com",
  enableInvoiceEmail: true,
  enableDispatchEmail: true,
  enableVipPatronWelcome: true,
};

export const INITIAL_OTP_RULES: OTPVerificationRules = {
  enabledOnCheckout: true,
  mandatoryForCOD: true,
  codThresholdBDT: 5000,
  otpLength: 6,
  expiryMinutes: 2,
  channels: "sms",
  maxAttempts: 3,
  lockoutMinutes: 15,
};

export const INITIAL_COMM_LOGS: CommunicationLogItem[] = [
  {
    id: "log-1",
    timestamp: "Today · 01:14 PM",
    channel: "SMS OTP",
    recipient: "+880 1711-234567",
    recipientName: "Farhana Nasrin",
    eventType: "OTP Verification",
    status: "Verified",
    contentSnippet: "839201 is your Inspire Lifestyle verification code. Valid for 2 mins.",
    gatewayResponse: "200 OK · Greenweb SMS · MSGID: GW-991204",
  },
  {
    id: "log-2",
    timestamp: "Today · 11:42 AM",
    channel: "Gmail SMTP",
    recipient: "tanzim.r@outlook.com",
    recipientName: "Tanzim Rahman",
    eventType: "Order Placed",
    status: "Delivered",
    contentSnippet: "Invoice & Order Confirmation #ORD-2026-0892 attached as PDF receipt.",
    gatewayResponse: "250 2.0.0 OK (smtp.gmail.com) accepted",
  },
  {
    id: "log-3",
    timestamp: "Oct 03, 2026 · 02:50 PM",
    channel: "SMS",
    recipient: "+880 1912-345678",
    recipientName: "Nusrat Jahan",
    eventType: "Consignment Dispatched",
    status: "Delivered",
    contentSnippet: "Dear Nusrat Jahan, order #ORD-2026-0894 dispatched via Steadfast. Tracking: STF-992118",
    gatewayResponse: "200 OK · Greenweb SMS · MSGID: GW-990812",
  },
  {
    id: "log-4",
    timestamp: "Oct 02, 2026 · 09:20 AM",
    channel: "SMS",
    recipient: "+880 1711-234567",
    recipientName: "Farhana Nasrin",
    eventType: "Consignment Dispatched",
    status: "Delivered",
    contentSnippet: "Dear Farhana Nasrin, order #ORD-2026-0891 dispatched via Steadfast. Tracking: STF-992104",
    gatewayResponse: "200 OK · Greenweb SMS · MSGID: GW-988941",
  },
  {
    id: "log-5",
    timestamp: "Oct 01, 2026 · 08:46 PM",
    channel: "Gmail SMTP",
    recipient: "farhana.nasrin@example.com",
    recipientName: "Farhana Nasrin",
    eventType: "Order Placed",
    status: "Delivered",
    contentSnippet: "Formal invoice for Tailored Virgin Wool Blazer (৳3,530 via bKash).",
    gatewayResponse: "250 2.0.0 OK (smtp.gmail.com) accepted",
  },
];
