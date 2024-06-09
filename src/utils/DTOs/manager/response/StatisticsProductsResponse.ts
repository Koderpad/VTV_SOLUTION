import {StatisticsProductDTO} from "@/utils/DTOs/manager/dto/StatisticsProductDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface StatisticsProductsResponse extends ResponseAbstract {
    count: number;
    totalOrder: number;
    totalMoney: number;
    totalSold: number; // Assuming Long is treated as number in your usage
    dateStart: Date;
    dateEnd: Date;
    statisticsProductDTOs: StatisticsProductDTO[];
}
