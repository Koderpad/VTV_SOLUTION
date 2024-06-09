import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {StatisticsOrderDTO} from "@/utils/DTOs/manager/dto/StatisticsOrderDTO.ts";

export interface StatisticsOrdersResponse extends ResponseAbstract {
    count: number;
    totalOrder: number;
    totalMoney: number;
    dateStart: Date;
    dateEnd: Date;
    statisticsOrderDTOs: StatisticsOrderDTO[];
}