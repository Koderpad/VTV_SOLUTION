export interface ListVoucherShopResponse {
  status: string;
  message: string;
  code: number;
  shopId: number;
  shopName: string;
  count: number;
  voucherDTOs: VoucherDTO[];
}

export interface VoucherDTO {
  voucherId: number;
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
  code: string;
  name: string;
  description: string;
  discount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  quantityUsed: number;
  type: "PERCENTAGE_SHOP" | "PERCENTAGE_SYSTEM" | "MONEY_SHOP" | "MONEY_SYSTEM";
}
