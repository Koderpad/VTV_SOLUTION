import { apiSlice } from "@/redux/api.ts";
import TransportResponse from "@/utils/DTOs/shipping/response/TransportResponse.ts";
import { TransportStatus } from "@/utils/DTOs/extra/TransportStatus.ts";
import {ShopAndTransportResponse} from "@/utils/DTOs/shipping/response/ShopAndTransportResponse.ts";
import {ShopAndTransportsDTO} from "@/utils/DTOs/shipping/dto/ShopAndTransportsDTO.ts";

export const TransportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getTransportResponseByTransportId: builder.query<TransportResponse, { transportId: string }>({
            query: ({ transportId }) => `/shipping/transport/get/${transportId}`,
        }),

        findTransportResponseByTransportId: builder.mutation<TransportResponse, string>({
            query: (transportId) => ({
                url: `/shipping/transport/get/${transportId}`,
                method: 'GET',
            })
        }),



        updateStatusTransportByDeliver: builder.mutation<
            TransportResponse, { transportId: string, status: TransportStatus, handled: boolean, wardCode: string }>({
            query: ({ transportId, status, handled, wardCode }) => ({
                url: `/shipping/transport/update-status/${transportId}?status=${status}&handled=${handled}&wardCode=${wardCode}`,
                method: 'PATCH',
            }),
        }),

        updateTransportStatusWithReturnOrderByDeliver: builder.mutation<
            TransportResponse, { transportId: string, status: TransportStatus, handled: boolean, wardCode: string }>({
            query: ({ transportId, status, handled, wardCode }) => ({
                url: `/shipping/transport/return/update-status/${transportId}?status=${status}&handled=${handled}&wardCode=${wardCode}`,
                method: 'PATCH',
            }),
        }),

        updateTransportStatusWithCancelReturnOrderByDeliver: builder.mutation<
            TransportResponse, { transportId: string, reason: string }>({
            query: ({ transportId, reason }) => ({
                url: `/shipping/transport/cancel-return/${transportId}`,
                method: 'PATCH',
                body: { reason },
            }),
        }),

        updateTransportStatusWithSuccessReturnOrderByDeliver: builder.mutation<
            TransportResponse, { transportId: string, reason: string }>({
            query: ({ transportId, reason }) => ({
                url: `/shipping/transport/success-return/${transportId}`,
                method: 'PATCH',
                body: { reason },
            }),
        }),

        getTransportsByWardWorksDeliver: builder.query<ShopAndTransportResponse, void>({
            query: () => `/shipping/transport/get-by-ward-work`,
        }),

        getTransportsByWard: builder.query<ShopAndTransportResponse, string>({
            query: (wardCode) => `/shipping/transport/get/ward/${wardCode}`,
        }),

        getTransportsByDistrictCode: builder.query<ShopAndTransportResponse, string>({
            query: (districtCode) => `/shipping/transport/list/district/${districtCode}`,
        }),



        getShopAndTransportsDTOByShopId: builder.query<ShopAndTransportsDTO, number>({
            query: (shopId) => `/shipping/transport/get/shop/${shopId}`,
        }),

    }),
});

export const {
    useGetTransportResponseByTransportIdQuery,
    useFindTransportResponseByTransportIdMutation,
    useUpdateStatusTransportByDeliverMutation,
    useUpdateTransportStatusWithReturnOrderByDeliverMutation,
    useUpdateTransportStatusWithCancelReturnOrderByDeliverMutation,
    useUpdateTransportStatusWithSuccessReturnOrderByDeliverMutation,
    useGetTransportsByWardWorksDeliverQuery,
    useGetTransportsByWardQuery,
    useGetTransportsByDistrictCodeQuery ,
    useGetShopAndTransportsDTOByShopIdQuery,
} = TransportApiSlice;
