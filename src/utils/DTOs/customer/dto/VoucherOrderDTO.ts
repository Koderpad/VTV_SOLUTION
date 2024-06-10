export interface VoucherOrderDTO {
    voucherOrderId: number;
    voucherId: number;
    voucherName: string;
    type: boolean;
    orderId: string; // UUID represented as string
}