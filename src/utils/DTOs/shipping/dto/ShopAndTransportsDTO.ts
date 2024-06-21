import {TransportDTO} from "@/utils/DTOs/shipping/dto/TransportDTO.ts";
import {ShopDTO} from "@/utils/DTOs/shop/dto/ShopDTO.ts";

export interface ShopAndTransportsDTO {
    count: number;
    wardCode: string;
    wardName: string;
    shopDTO: ShopDTO;
    transportDTOs: TransportDTO[];
}