import {CustomerDTO} from "@/utils/DTOs/manager/dto/CustomerDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface CustomerPageResponse extends ResponseAbstract {
    count: number;
    page: number;
    size: number;
    totalPage: number;
    totalCustomer: number;
    customerDTOs: CustomerDTO[];
}