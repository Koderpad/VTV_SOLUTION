import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { CashOrderDTO } from "../dto/CashOrderDTO";

export interface CashOrdersResponse extends ResponseAbstract {
    count: number;
    totalMoney: number;
    cashOrderDTOs: CashOrderDTO[];
}