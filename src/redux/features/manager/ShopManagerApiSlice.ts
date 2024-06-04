import {apiSlice} from "@/redux/api.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {ShopResponse} from "@/utils/DTOs/manager/response/ShopResponse.ts";
import {ShopPageResponse} from "@/utils/DTOs/manager/response/ShopPageResponse.ts";
import {ManagerShopResponse} from "@/utils/DTOs/manager/response/ManagerShopResponse.ts";
import {ManagerShopPageResponse} from "@/utils/DTOs/manager/response/ManagerShopPageResponse.ts";

export const ShopManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getShopById: builder.query<ShopResponse, number>({
            query: (shopId) => `/manager/shop/${shopId}`,
        }),

        getShopsByStatus: builder.query<ShopPageResponse, { status: Status, page: number, size: number }>({
            query: ({status, page, size}) => `/manager/shop/page/status/${status}?page=${page}&size=${size}`,
        }),

        getShopsByNameAndStatus: builder.query<ShopPageResponse, { search: string, status: Status, page: number, size: number }>({
            query: ({search, status, page, size}) => `/manager/shop/page/search/${search}/status/${status}?page=${page}&size=${size}`,
        }),

        lockShopByShopId: builder.mutation<ManagerShopResponse, { shopId: number, note: string }>({
            query: ({shopId, note}) => ({
                url: `/manager/shop/lock/${shopId}`,
                method: 'POST',
                body: note,
            }),
        }),

        unlockShopByShopId: builder.mutation<ManagerShopResponse, { shopId: number, note: string }>({
            query: ({shopId, note}) => ({
                url: `/manager/shop/unlock/${shopId}`,
                method: 'POST',
                body: note,
            }),
        }),

        getManagerShopPageByLock: builder.query<ManagerShopPageResponse, { lock: boolean, page: number, size: number }>({
            query: ({lock, page, size}) => `/manager/shop/manager-shop/page/lock/${lock}?page=${page}&size=${size}`,
        }),

        getManagerShopPageByNameAndLock: builder.query<ManagerShopPageResponse, { search: string, lock: boolean, page: number, size: number }>({
            query: ({search, lock, page, size}) => `/manager/shop/manager-shop/page/search/${search}/lock/${lock}?page=${page}&size=${size}`,
        }),






    }),
});

export const {
    useGetShopByIdQuery,
    useGetShopsByStatusQuery,
    useGetShopsByNameAndStatusQuery,
    useLockShopByShopIdMutation,
    useUnlockShopByShopIdMutation,
    useGetManagerShopPageByLockQuery,
    useGetManagerShopPageByNameAndLockQuery,
} = ShopManagerApiSlice;