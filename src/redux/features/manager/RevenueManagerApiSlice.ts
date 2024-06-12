import {apiSlice} from "@/redux/api.ts";
import {StatisticsCustomersResponse} from "@/utils/DTOs/manager/response/StatisticsCustomersResponse.ts";
import {StatisticsOrdersResponse} from "@/utils/DTOs/manager/response/StatisticsOrdersResponse.ts";
import {OrderStatus} from "@/utils/DTOs/extra/OrderStatus.ts";
import {StatisticsProductsResponse} from "@/utils/DTOs/manager/response/StatisticsProductsResponse.ts";
import {StatisticsTransportsResponse} from "@/utils/DTOs/shipping/response/StatisticsTransportsResponse.ts";
import {StatisticsFeeOrderResponse} from "@/utils/DTOs/manager/response/StatisticsFeeOrderResponse.ts";

export const RevenueManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        statisticsCustomersByDateAndStatus: builder.query<
            StatisticsCustomersResponse, { startDate: string; endDate: string }>({
            query: ({startDate, endDate}) =>
                `/manager/revenue/statistics/customers?startDate=${startDate}&endDate=${endDate}`,
        }),


        statisticsOrderByDateAndStatus: builder.query<
            StatisticsOrdersResponse, { startDate: string; endDate: string; status: OrderStatus }>({
            query: ({startDate, endDate, status}) =>
                `/manager/revenue/statistics/orders/status/${status}?startDate=${startDate}&endDate=${endDate}`,
        }),


        getTopProductByLimitAndDate: builder.query<
            StatisticsProductsResponse, { limit: number; startDate: string; endDate: string }>({
            query: ({limit, startDate, endDate}) =>
                `/manager/revenue/statistics/products/limit/${limit}?startDate=${startDate}&endDate=${endDate}`,
        }),


        statisticsTransportsByDate: builder.query<
            StatisticsTransportsResponse, { shippingMethod: string; startDate: string; endDate: string }>({
            query: ({shippingMethod, startDate, endDate}) =>
                `/manager/revenue/statistics/transports/method/${shippingMethod}?startDate=${startDate}&endDate=${endDate}`,
        }),


        statisticsFeeOrderByDate: builder.query<
            StatisticsFeeOrderResponse, { startDate: string; endDate: string }>({
            query: ({startDate, endDate}) =>
                `/manager/revenue/statistics/fee-order?startDate=${startDate}&endDate=${endDate}`,
        }),

    }),
});

export const {
    useStatisticsCustomersByDateAndStatusQuery,
    useStatisticsOrderByDateAndStatusQuery,
    useGetTopProductByLimitAndDateQuery,
    useStatisticsTransportsByDateQuery,
    useStatisticsFeeOrderByDateQuery,
} = RevenueManagerApiSlice;
