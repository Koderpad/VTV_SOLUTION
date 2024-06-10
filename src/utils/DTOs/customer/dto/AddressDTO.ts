import {Status} from "@/utils/DTOs/extra/Status.ts";

export interface AddressDTO {
    addressId: number;
    provinceName: string;
    provinceFullName: string;
    districtName: string;
    districtFullName: string;
    wardName: string;
    wardFullName: string;
    fullAddress: string;
    fullName: string;
    phone: string;
    status: Status; // Assuming Status is an existing enum/type
    wardCode: string;
}