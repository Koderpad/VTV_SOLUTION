import {TransportProviderDTO} from "@/utils/DTOs/shipping/dto/TransportProviderDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface TransportProviderResponse extends ResponseAbstract {
    transportProviderDTO: TransportProviderDTO;
}