import { CashOrderDTO } from "./CashOrderDTO";

export interface CashOrdersByDateDTO {
    date: string;
    count: number;
    totalMoney: number;
    cashOrderDTOs: CashOrderDTO[];
}