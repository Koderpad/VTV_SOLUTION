import { apiSlice } from "@/redux/api";
import { StatisticsOrdersResponse } from "@/utils/DTOs/vendor/revenue/Response/StatisticsOrdersResponse";
import { StatisticsProductsResponse } from "@/utils/DTOs/vendor/revenue/Response/StatisticsProductsResponse";

export const revenueApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRevenueStatisticsByStatus: builder.query<
      StatisticsOrdersResponse,
      { status: string; startDate: string; endDate: string }
    >({
      query: ({ status, startDate, endDate }) => ({
        url: `/vendor/shop/revenue/statistics/status/${status}`,
        method: "GET",
        params: { startDate, endDate },
      }),
    }),
    getTopProductsRevenue: builder.query<
      StatisticsProductsResponse,
      { limit: number; startDate: string; endDate: string }
    >({
      query: ({ limit, startDate, endDate }) => ({
        url: `/vendor/shop/revenue/statistics/product/top/${limit}`,
        method: "GET",
        params: { startDate, endDate },
      }),
    }),
  }),
});

export const {
  useGetRevenueStatisticsByStatusQuery,
  useGetTopProductsRevenueQuery,
} = revenueApiSlice;
