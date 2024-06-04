import { ResponseAbstract } from "../../extra/ResponseAbstract";
import {ManagerShopDTO} from "@/utils/DTOs/manager/dto/ManagerShopDTO.ts";

export interface ManagerShopPageResponse extends ResponseAbstract {
    count: number;
    size: number;
    page: number;
    totalPage: number;
    totalManagerShop: number;
    managerShopDTOs: ManagerShopDTO[];
}