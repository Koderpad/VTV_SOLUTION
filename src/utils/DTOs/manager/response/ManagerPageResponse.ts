import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {ManagerDTO} from "@/utils/DTOs/manager/dto/ManagerDTO.ts";

export interface ManagerPageResponse extends ResponseAbstract {
    count: number;
    size: number;
    page: number;
    totalPage: number;
    totalManager: number;
    managerDTOs: ManagerDTO[];
}