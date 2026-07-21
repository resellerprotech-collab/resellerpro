export const APP_NAME = 'ResellerPro'
export const APP_DESCRIPTION = 'Manage your reselling business like a pro'

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'processing', label: 'Processing', color: 'blue' },
  { value: 'shipped', label: 'Shipped', color: 'purple' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'partially_paid', label: 'Partially Paid', color: 'orange' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'refunded', label: 'Refunded', color: 'gray' },
] as const

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cod', label: 'Cash on Delivery' },
] as const

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty & Personal Care',
  'Sports & Fitness',
  'Books & Stationery',
  'Toys & Games',
  'Automotive',
  'Food & Beverages',
  'Other',
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
] as const

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    features: [
      'Up to 10 orders/month',
      'Basic features',
      '1 user',
      'Email support',
    ],
    limits: {
      orders: 10,
      users: 1,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 499,
    interval: 'month',
    features: [
      'Up to 50 orders/month',
      'All features',
      '1 user',
      'WhatsApp support',
      'Remove branding',
    ],
    limits: {
      orders: 50,
      users: 1,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 999,
    interval: 'month',
    popular: true,
    features: [
      'Unlimited orders',
      'All features',
      '3 users',
      'Priority support',
      'Analytics dashboard',
      'Smart paste feature',
    ],
    limits: {
      orders: null,
      users: 3,
    },
  },
  {
    id: 'business',
    name: 'Business',
    price: 1999,
    interval: 'month',
    features: [
      'Everything in Professional',
      '10 users',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'White-label option',
    ],
    limits: {
      orders: null,
      users: 10,
    },
  },
] as const