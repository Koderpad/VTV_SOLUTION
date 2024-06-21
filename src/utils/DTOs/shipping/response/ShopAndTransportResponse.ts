import { ResponseAbstract } from "../../extra/ResponseAbstract";
import { WardDTO } from "../../location/dto/WardDTO";
import { ShopAndTransportsDTO } from "../dto/ShopAndTransportsDTO";

export interface ShopAndTransportResponse extends ResponseAbstract {
    countShop: number;
    countTransport: number;
    countWard: number;
    wardDTOs: WardDTO[];
    shopAndTransportsDTOs: ShopAndTransportsDTO[];
}