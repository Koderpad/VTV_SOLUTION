import { ResponseAbstract } from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { VoucherDTO } from "@/utils/DTOs/manager/dto/VoucherDTO.ts";

export interface ListVoucherResponse extends ResponseAbstract {
    count: number;
    voucherDTOs: VoucherDTO[];
}