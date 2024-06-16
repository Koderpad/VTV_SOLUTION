import {TransportStatus} from "@/utils/DTOs/extra/TransportStatus.ts";
import {TransportHandleDTO} from "@/utils/DTOs/shipping/dto/TransportHandleDTO.ts";

export interface TransportDTO {
    transportId: string; // UUID represented as string
    wardCodeShop: string;
    wardCodeCustomer: string;
    orderId: string; // UUID represented as string
    shopId: number;
    shippingMethod: string;
    status: TransportStatus; // Assuming TransportStatus is an existing enum/type
    createAt: string;
    updateAt: string;
    totalTransportHandle: number;
    transportHandleDTOs: TransportHandleDTO[];
}