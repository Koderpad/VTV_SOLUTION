import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { DeliverDTO } from "../dto/DeliverDTO";

export interface ListDeliverResponse extends ResponseAbstract {
    count: number;
    deliverDTOs: DeliverDTO[];
}