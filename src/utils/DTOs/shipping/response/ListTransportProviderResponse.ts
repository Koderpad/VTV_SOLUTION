import {TransportProviderDTO} from "@/utils/DTOs/shipping/dto/TransportProviderDTO.ts";

export interface ListTransportProviderResponse {
    count: number;
    transportProviderDTOs: TransportProviderDTO[];
}