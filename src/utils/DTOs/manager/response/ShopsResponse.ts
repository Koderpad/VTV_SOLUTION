import {ShopDTO} from "@/utils/DTOs/manager/dto/ShopDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface ShopsResponse extends ResponseAbstract {
    page: number;
    size: number;
    count: number;
    totalPage: number;
    shopDTOs: ShopDTO[];
}