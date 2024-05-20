import {Status} from "@/utils/DTOs/extra/Status.ts";
import {VoucherType} from "@/utils/DTOs/extra/VoucherType.ts";

export interface VoucherDTO {
    voucherId: number;
    status: Status;
    code: string;
    name: string;
    description: string;
    discount: number;
    quantity: number;
    startDate: Date;
    endDate: Date;
    quantityUsed: number;
    type: VoucherType;
}