export interface StatisticsTransportDTO {
    totalTransport: number;
    totalFeeShipping: number | null; // Assuming Long translates to number or null in TS
    date: Date;
}
