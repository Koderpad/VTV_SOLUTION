import { ResponseAbstract } from "../../extra/ResponseAbstract";
import { StatisticsTransportDTO } from "../dto/StatisticsTransportDTO";

export interface StatisticsTransportsResponse extends ResponseAbstract {
    count: number;
    totalFee: number | null; // Assuming Long translates to number or null in TS
    dateStart: Date;
    dateEnd: Date;
    statisticsTransportDTOs: StatisticsTransportDTO[];
}
