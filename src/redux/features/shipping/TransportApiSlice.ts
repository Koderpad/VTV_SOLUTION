import {apiSlice} from "@/redux/api.ts";


import TransportResponse from "@/utils/DTOs/shipping/response/TransportResponse.ts";

export const TransportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getTransportResponseByTransportId: builder.query<
            TransportResponse, { transportId: string }>({
            query: ({transportId}) =>
                `/shipping/transport/get/${transportId}`,
        }),


    }),
});

export const {

    useGetTransportResponseByTransportIdQuery,
} = TransportApiSlice;
