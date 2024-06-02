import {Status} from "@/utils/DTOs/extra/Status.ts";
import {Role} from "@/utils/DTOs/extra/Role.ts";

export interface CustomerDTO {
    customerId: number;
    username: string;
    email: string;
    gender: boolean;
    fullName: string;
    birthday: Date;
    status: Status;
    roles: Set<Role>;
}