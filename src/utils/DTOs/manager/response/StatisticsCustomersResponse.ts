import {StatisticsCustomerDTO} from "@/utils/DTOs/manager/dto/StatisticsCustomerDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface StatisticsCustomersResponse extends ResponseAbstract {
    count: number;
    totalCustomer: number;
    dateStart: Date;
    dateEnd: Date;
    statisticsCustomerDTOs: StatisticsCustomerDTO[];
}