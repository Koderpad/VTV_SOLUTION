import {RegisterRequest} from "@/utils/DTOs/manager/request/RegisterRequest.ts";
import {FeeShippingRequest} from "@/utils/DTOs/manager/request/FeeShippingRequest.ts";

export interface TransportProviderRegisterRequest {
    fullName: string;
    shortName: string;
    email: string;
    phone: string;
    provincesCode: string[];
    usernameAdded: string;
    feeShippingRequest: FeeShippingRequest;
    registerRequest: RegisterRequest;
}
