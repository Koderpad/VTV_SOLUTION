import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { TransportDTO } from "../dto/TransportDTO";


export interface TransportPageResponse extends ResponseAbstract {
    count: number;
    page: number;
    size: number;
    totalPage: number;
    transportDTOs: TransportDTO[];
}

