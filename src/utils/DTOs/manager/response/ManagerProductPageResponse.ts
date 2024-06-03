import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {ManagerProductDTO} from "@/utils/DTOs/manager/dto/ManagerProductDTO.ts";

export interface ManagerProductPageResponse extends ResponseAbstract {
    count: number;
    size: number;
    page: number;
    totalPage: number;
    totalManagerProduct: number;
    managerProductDTOs: ManagerProductDTO[]; // Array of ManagerProductDTO interfaces
}
