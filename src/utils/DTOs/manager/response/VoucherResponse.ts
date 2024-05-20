import { ResponseAbstract } from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { VoucherDTO } from "@/utils/DTOs/manager/dto/VoucherDTO.ts";

export interface VoucherResponse extends ResponseAbstract {
    voucherDTO: VoucherDTO;
}