export interface StatisticsFeeOrderDTO {
    count: number;
    paymentTotal: number | null; // Assuming Long translates to number or null in TS
    shopReceiveTotal: number | null; // Assuming Long translates to number or null in TS
    feeShippingTotal: number | null; // Assuming Long translates to number or null in TS
    feeSystemTotal: number | null; // Assuming Long translates to number or null in TS
    discountSystemTotal: number | null; // Assuming Long translates to number or null in TS
    discountShopTotal: number | null; // Assuming Long translates to number or null in TS
    date: Date;
}
