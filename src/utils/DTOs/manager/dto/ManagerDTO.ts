import {Role} from "@/utils/DTOs/extra/Role.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";

export interface ManagerDTO {
    managerId: number;
    status: Status;
    customerId: number;
    username: string;
    roles: Role[];
}