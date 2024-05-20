import {VoucherDTO} from "@/utils/DTOs/manager/dto/VoucherDTO.ts";
import {VoucherSystemRequest} from "@/utils/DTOs/manager/request/VoucherSystemRequest.ts";

export const convertVoucherDTOToVoucherRequest = (voucherDTO: VoucherDTO): VoucherSystemRequest => {
    return {
        code: voucherDTO.code,
        name: voucherDTO.name,
        description: voucherDTO.description,
        discount: voucherDTO.discount,
        quantity: voucherDTO.quantity,
        startDate: new Date(voucherDTO.startDate),
        endDate: new Date(voucherDTO.endDate),
        type: voucherDTO.type,
    };
}