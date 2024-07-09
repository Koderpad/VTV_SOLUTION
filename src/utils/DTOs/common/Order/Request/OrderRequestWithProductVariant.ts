export interface OrderRequestWithProductVariant {
  addressId: number;
  systemVoucherCode: string | null | undefined;
  shopVoucherCode: string | null | undefined;
  paymentMethod: string;
  shippingMethod: string;
  note: string;
  useLoyaltyPoint: boolean;
  productVariantIdsAndQuantities: {
    [productVariantId: string]: number;
  };
}
