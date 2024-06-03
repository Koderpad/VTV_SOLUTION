import {Status} from "@/utils/DTOs/extra/Status.ts";

export interface ShopDTO {
    shopId: number;
    name: string;
    address: string;
    provinceName: string;
    districtName: string;
    wardName: string;
    phone: string;
    email: string;
    avatar: string;
    description: string;
    openTime: string;
    closeTime: string;
    status: Status;
    customerId: number;
    shopUsername: string;
    wardCode: string;
}