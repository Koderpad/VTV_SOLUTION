export interface VoucherResponse {
  status: string;
  message: string;
  code: number;
  voucherDTO: VoucherDTO;
}

export interface VoucherDTO {
  voucherId: number;
  status: string;
  code: string;
  name: string;
  description: string;
  discount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  quantityUsed: number;
  type: string;
}
