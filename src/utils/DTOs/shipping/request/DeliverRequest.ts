import {TypeWork} from "@/utils/DTOs/extra/TypeWork.ts";
import { RegisterRequest } from "../../manager/request/RegisterRequest";

export interface DeliverRequest {
    phone: string;
    wardCode: string;
    fullAddress: string;
    typeWork: TypeWork;
    districtCodeWork: string;
    wardsCodeWork: string[];
    registerCustomerRequest: RegisterRequest;
}