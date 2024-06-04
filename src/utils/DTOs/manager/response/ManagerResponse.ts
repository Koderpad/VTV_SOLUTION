import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {ManagerDTO} from "@/utils/DTOs/manager/dto/ManagerDTO.ts";

export interface ManagerResponse extends ResponseAbstract {
    managerDTO: ManagerDTO;
}