export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CheckoutRequest {
  shippingAddress: string;
  paymentMethod: 'CreditCard' | 'PayPal' | 'CashOnDelivery' | 'Wallet';
  guestEmail?: string;
  guestName?: string;
}

export interface OrderResponse {
  id: number;
  orderDate: string;
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}
