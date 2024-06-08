import {Status} from "@/utils/DTOs/extra/Status.ts";
import {ProvinceDTO} from "@/utils/DTOs/location/dto/ProvinceDTO.ts";
import {FeeShippingDTO} from "@/utils/DTOs/shipping/dto/FeeShippingDTO.ts";


export interface TransportProviderDTO {
    transportProviderId: number;
    fullName: string;
    shortName: string;
    email: string;
    phone: string;
    usernameAdded: string;
    status: Status;
    customerId: number;
    countProvince: number;
    feeShippingDTO: FeeShippingDTO;
    provinceDTOs: ProvinceDTO[];
}