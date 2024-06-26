import { apiSlice } from "@/redux/api.ts";
import {  TransportProviderResponse } from "@/utils/DTOs/shipping/response/TransportProviderResponse.ts";
import {
    UpdateTransportProviderWithProvincesRequest
} from "@/utils/DTOs/manager/request/UpdateTransportProviderWithProvincesRequest.ts";
import {TransportProviderRegisterRequest} from "@/utils/DTOs/manager/request/TransportProviderRegisterRequest.ts";
import {ListTransportProviderResponse} from "@/utils/DTOs/shipping/response/ListTransportProviderResponse.ts";
import {FeeShippingRequest} from "@/utils/DTOs/manager/request/FeeShippingRequest.ts";

export const TransportProviderManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addNewTransportProvider: builder.mutation<TransportProviderResponse, TransportProviderRegisterRequest>({
            query: (request) => ({
                url: '/manager/transport-provider/add',
                method: 'POST',
                body: request,
            }),
        }),


        updateTransportProviderProvinces: builder.mutation<TransportProviderResponse, UpdateTransportProviderWithProvincesRequest>({
            query: (request) => ({
                url: '/manager/transport-provider/update',
                method: 'PUT',
                body: request,
            }),
        }),

        updateTransportProviderFeeShipping: builder.mutation<TransportProviderResponse, { request: FeeShippingRequest, transportProviderId: number }>({
            query: ({ request, transportProviderId }) => ({
                url: `/manager/transport-provider/update-fee-shipping/${transportProviderId}`,
                method: 'PUT',
                body: request,
            }),
        }),




        getAllTransportProviders: builder.query<ListTransportProviderResponse, void>({
            query: () => ({
                url: '/manager/transport-provider/all',
                method: 'GET',
            }),
        }),


        getTransportProviderDetail: builder.query<TransportProviderResponse, number>({
            query: (transportProviderId) => ({
                url: `/manager/transport-provider/detail/${transportProviderId}`,
                method: 'GET',
            }),
        }),
    }),
});



export const {
    useAddNewTransportProviderMutation,
    useUpdateTransportProviderProvincesMutation,
    useUpdateTransportProviderFeeShippingMutation,
    useGetAllTransportProvidersQuery,
    useGetTransportProviderDetailQuery,
} = TransportProviderManagerApiSlice;
