import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { CashOrdersByDateDTO } from "../dto/CashOrdersByDateDTO";

export interface CashOrdersByDatesResponse extends ResponseAbstract {
    count: number;
    cashOrdersByDateDTOs: CashOrdersByDateDTO[];
}