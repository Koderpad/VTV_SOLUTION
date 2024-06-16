import {apiSlice} from "@/redux/api.ts";

import {TransportPageResponse} from "@/utils/DTOs/shipping/response/TransportPageResponse.ts";
import {TransportStatus} from "@/utils/DTOs/extra/TransportStatus.ts";

export const ManagerTransportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getTransportPageByManagerAndDate: builder.query<
            TransportPageResponse, { status: TransportStatus, page: number; size: number; startDate: string; endDate: string }>({
            query: ({status, page, size, startDate, endDate}) =>
                `/shipping/manager/transport/page/status/${status}/date?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`,
        }),


    }),
});

export const {

    useGetTransportPageByManagerAndDateQuery,
} = ManagerTransportApiSlice;
