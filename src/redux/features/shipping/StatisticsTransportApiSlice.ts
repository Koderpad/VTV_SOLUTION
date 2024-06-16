import {apiSlice} from "@/redux/api.ts";

import {StatisticsTransportsResponse} from "@/utils/DTOs/shipping/response/StatisticsTransportsResponse.ts";

export const StatisticsTransportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        statisticsTransportsByDateAndUsername: builder.query<
            StatisticsTransportsResponse, { startDate: string; endDate: string }>({
            query: ({startDate, endDate}) =>
                `/shipping/manager/statistics/revenue?startDate=${startDate}&endDate=${endDate}`,
        }),

    }),
});

export const {

    useStatisticsTransportsByDateAndUsernameQuery,
} = StatisticsTransportApiSlice;
