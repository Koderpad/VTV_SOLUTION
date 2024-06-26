import {apiSlice} from "@/redux/api.ts";
import {CashOrdersRequest} from "@/utils/DTOs/shipping/request/CashOrdersRequest.ts";
import {CashOrdersResponse} from "@/utils/DTOs/shipping/response/CashOrdersResponse.ts";
import {CashOrdersByDatesResponse} from "@/utils/DTOs/shipping/response/CashOrdersByDatesResponse.ts";
import {CashOrderDetailResponse} from "@/utils/DTOs/shipping/response/CashOrderDetailResponse.ts";


export const CashOrderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        shipperUpdateCashOrdersByShipper: builder.mutation<CashOrdersResponse, CashOrdersRequest>({
            query: (body) => ({
                url: `shipping/cash-order/updates/transfers-money-warehouse`,
                method: "POST",
                body,
            })
        }),

        shipperUpdateCashOrdersByWareHouse: builder.mutation<CashOrdersResponse, CashOrdersRequest>({
            query: (body) => ({
                url: `shipping/cash-order/updates/confirm-money-warehouse`,
                method: "POST",
                body,
            })
        }),


        wareHouseUpdateCashOrdersByWaveHouse: builder.mutation<CashOrdersResponse, string[]>({
            query: (body) => ({
                url: `shipping/cash-order/updates/warehouse-confirm`,
                method: "POST",
                body,
            })
        }),

        getCashOrdersByWareHouseUsername: builder.query<CashOrdersResponse, void>({
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


        historyCashOrdersByShipper: builder.mutation<CashOrdersByDatesResponse, {
            shipperHold: boolean;
            shipping: boolean;
        }>({
            query: ({shipperHold, shipping}) => ({
                url: `shipping/cash-order/history-by-shipper?shipperHold=${shipperHold}&shipping=${shipping}`,
                method: "GET",
            }),
        }),


        historyCashOrdersByWarehouseUsername: builder.query<CashOrdersByDatesResponse, {
            warehouseHold: boolean;
            handlePayment: boolean;
        }>({
            query: ({warehouseHold, handlePayment}) => ({
                url: `shipping/cash-order/history-by-warehouse?warehouseHold=${warehouseHold}&handlePayment=${handlePayment}`,
                method: "GET",
            }),
        }),


        getDetailCashOrder: builder.query<CashOrderDetailResponse, string>({
            query: (cashOrderId) => ({
                url: `shipping/cash-order/detail/${cashOrderId}`,
            })
        }),

        getCashOrdersCanUpdateByShipperUsername: builder.query<CashOrdersResponse, void>({
            query: () => ({
                url: `shipping/cash-order/list/shipper/can-update`,
                method: "GET",
            })
        }),


        getCashOrdersCanUpdateByWareHouseUsername: builder.query<CashOrdersResponse, void>({
            query: () => ({
                url: `shipping/cash-order/list/ware-house/can-update`,
                method: "GET",
            })
        }),


    }),
});

export const {

    useShipperUpdateCashOrdersByShipperMutation,
    useShipperUpdateCashOrdersByWareHouseMutation,
    useWareHouseUpdateCashOrdersByWaveHouseMutation,
    useGetCashOrdersByWareHouseUsernameQuery,
    useGetAllCashOrdersByShipperUsernameQuery,
    useHistoryCashOrdersByShipperUsernameQuery,
    useHistoryCashOrdersByShipperMutation,
    useHistoryCashOrdersByWarehouseUsernameQuery,
    useGetDetailCashOrderQuery,
    useGetCashOrdersCanUpdateByShipperUsernameQuery,
    useGetCashOrdersCanUpdateByWareHouseUsernameQuery,


} = CashOrderApiSlice;