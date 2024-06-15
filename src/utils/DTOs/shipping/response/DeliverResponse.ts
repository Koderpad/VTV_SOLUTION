import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { DeliverDTO } from "../dto/DeliverDTO";

export interface DeliverResponse extends ResponseAbstract {
    deliverDTO: DeliverDTO;
}