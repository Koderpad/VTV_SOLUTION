import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {ShopDTO} from "@/utils/DTOs/manager/dto/ShopDTO.ts";
import {ManagerShopDTO} from "@/utils/DTOs/manager/dto/ManagerShopDTO.ts";

export interface ManagerShopResponse extends ResponseAbstract {
    shopDTO: ShopDTO;
    managerShopDTO: ManagerShopDTO;
}