import {ShopDTO} from "@/utils/DTOs/manager/dto/ShopDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface ShopResponse extends ResponseAbstract {
    shopDTO: ShopDTO;
}