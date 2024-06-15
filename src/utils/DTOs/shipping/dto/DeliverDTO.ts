import { DistrictDTO } from "../../location/dto/DistrictDTO";
import { WardDTO } from "../../location/dto/WardDTO";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {TypeWork} from "@/utils/DTOs/extra/TypeWork.ts";

export interface DeliverDTO {
    deliverId: number; // Assuming Long is a synonym for number in TypeScript
    phone: string;
    provinceName: string;
    districtName: string;
    wardName: string;
    fullAddress: string;
    typeWork: TypeWork;
    usernameAdded: string;
    status: Status;
    wardCode: string;
    customerId: number; // Assuming Long is a synonym for number in TypeScript
    usernameCustomer: string;
    emailCustomer: string;
    transportProviderId: number; // Assuming Long is a synonym for number in TypeScript
    transportProviderShortName: string;
    districtWork: DistrictDTO;
    countWardWork: number;
    wardsWork: WardDTO[];
}