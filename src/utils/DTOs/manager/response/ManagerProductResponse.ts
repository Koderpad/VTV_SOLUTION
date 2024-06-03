import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {ManagerProductDTO} from "@/utils/DTOs/manager/dto/ManagerProductDTO.ts";

export interface ManagerProductResponse extends ResponseAbstract {
    managerProductDTO: ManagerProductDTO; // Reference to ManagerProductDTO interface
}
