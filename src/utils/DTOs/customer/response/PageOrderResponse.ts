import {OrderDTO} from "@/utils/DTOs/customer/dto/OrderDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface PageOrderResponse extends ResponseAbstract {
    count: number;
    page: number;
    size: number;
    totalPage: number;
    orderDTOs: OrderDTO[];
}