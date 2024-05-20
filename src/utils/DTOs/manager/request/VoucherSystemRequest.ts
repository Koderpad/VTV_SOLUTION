export interface VoucherSystemRequest {
    code: string;
    name: string;
    description: string;
    discount: number;
    quantity: number;
    startDate: Date;
    endDate: Date;
    type: string;
}