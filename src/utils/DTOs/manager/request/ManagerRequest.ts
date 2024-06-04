import {Role} from "@/utils/DTOs/extra/Role.ts";

export interface ManagerRequest {
    usernameCustomer: string;
    role: Role;
}