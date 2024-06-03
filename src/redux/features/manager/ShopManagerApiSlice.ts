import {apiSlice} from "@/redux/api.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {ShopResponse} from "@/utils/DTOs/manager/response/ShopResponse.ts";
import {ShopsResponse} from "@/utils/DTOs/manager/response/ShopsResponse.ts";

export const ShopManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getShopById: builder.query<ShopResponse, number>({
            query: (shopId) => `/manager/shop/${shopId}`,
        }),

        getShopsByStatus: builder.query<ShopsResponse, { status: Status, page: number, size: number }>({
            query: ({status, page, size}) => `/manager/shop/page/status/${status}?page=${page}&size=${size}`,
        }),

        getShopsByNameAndStatus: builder.query<ShopsResponse, { search: string, status: Status, page: number, size: number }>({
            query: ({search, status, page, size}) => `/manager/shop/page/search/${search}/status/${status}?page=${page}&size=${size}`,
        }),


    }),
});

export const {
    useGetShopByIdQuery,
    useGetShopsByStatusQuery,
    useGetShopsByNameAndStatusQuery,
} = ShopManagerApiSlice;