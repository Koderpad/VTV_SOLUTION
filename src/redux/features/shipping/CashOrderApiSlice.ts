import {apiSlice} from "@/redux/api.ts";
import {CashOrdersRequest} from "@/utils/DTOs/shipping/request/CashOrdersRequest.ts";
import {CashOrdersResponse} from "@/utils/DTOs/shipping/response/CashOrdersResponse.ts";
import {CashOrdersByDatesResponse} from "@/utils/DTOs/shipping/response/CashOrdersByDatesResponse.ts";
import {CashOrderDetailResponse} from "@/utils/DTOs/shipping/response/CashOrderDetailResponse.ts";
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

export const CashOrderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        shipperUpdateCashOrdersByShipper: builder.mutation<CashOrdersResponse, CashOrdersRequest>({
            query: (body) => ({
                url: `shipping/cash-order/updates/transfers-money-warehouse`,
                method: "POST",
                body,
            })
        }),

        shipperUpdateCashOrdersByWaveHouse: builder.mutation<CashOrdersResponse, CashOrdersRequest>({
            query: (body) => ({
                url: `shipping/cash-order/updates/confirm-money-shipper`,
                method: "POST",
                body,
            })
        }),

        getCashOrdersByWaveHouseUsername: builder.query<CashOrdersResponse, void>({
            query: () => ({
                url: `shipping/cash-order/list-by-ware-house`,
                method: "GET",
            }),
        }),

        getAllCashOrdersByShipperUsername: builder.query<CashOrdersResponse, void>({
            query: () => ({
                url: `shipping/cash-order/all-by-shipper`,
                method: "GET",
            }),
        }),

        historyCashOrdersByShipperUsername: builder.query<CashOrdersByDatesResponse, {
            shipperHold: boolean;
            shipping: boolean;
        }>({
            query: ({shipperHold, shipping}) => ({
                url: `shipping/cash-order/history-by-shipper?shipperHold=${shipperHold}&shipping=${shipping}`,
                method: "GET",
            }),
        }),

        historyCashOrdersByWarehouseUsername: builder.query<CashOrdersByDatesResponse, {
            waveHouseHold: boolean;
            shipping: boolean;
        }>({
            query: ({waveHouseHold, shipping}) => ({
                url: `shipping/cash-order/history-by-warehouse?waveHouseHold=${waveHouseHold}&shipping=${shipping}`,
                method: "GET",
            }),
        }),


        getDetailCashOrder: builder.query<CashOrderDetailResponse, string>({
            query: (cashOrderId) => ({
                url: `shipping/cash-order/detail/${cashOrderId}`,
            })
        }),
    }),
});

export const {

    useShipperUpdateCashOrdersByShipperMutation,
    useShipperUpdateCashOrdersByWaveHouseMutation,
    useGetCashOrdersByWaveHouseUsernameQuery,
    useGetAllCashOrdersByShipperUsernameQuery,
    useHistoryCashOrdersByShipperUsernameQuery,
    useHistoryCashOrdersByWarehouseUsernameQuery,
    useGetDetailCashOrderQuery,


} = CashOrderApiSlice;