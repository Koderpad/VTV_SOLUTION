export interface MultipleOrderRequestWithCart {
  orderRequestWithCarts: OrderRequestWithCart[];
}

export interface OrderRequestWithCart {
  addressId: number;
  systemVoucherCode: string;
  shopVoucherCode: string;
  paymentMethod: string;
  shippingMethod: string;
  note: string;
  useLoyaltyPoint: boolean;
  cartIds: string[];
}
