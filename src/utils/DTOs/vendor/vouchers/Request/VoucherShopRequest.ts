export interface VoucherShopRequest {
  code: string;
  name: string;
  description: string;
  discount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  type: string;
  username: string;
}
