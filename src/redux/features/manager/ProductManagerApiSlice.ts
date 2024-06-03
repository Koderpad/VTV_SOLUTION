import {apiSlice} from "@/redux/api.ts";
import {ManagerProductResponse} from "@/utils/DTOs/manager/response/ManagerProductResponse.ts";
import {ManagerProductPageResponse} from "@/utils/DTOs/manager/response/ManagerProductPageResponse.ts";
import {ProductPageResponse} from "@/utils/DTOs/manager/response/ProductPageResponse.ts";

export const ProductManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        lockProductByProductId: builder.mutation<ManagerProductResponse, { productId: number, note: string }>({
            query: ({productId, note}) => ({
                url: `/manager/product/lock/${productId}`,
                method: 'POST',
                body: note,
            }),
        }),

        unLockProductByProductId: builder.mutation<ManagerProductResponse, { productId: number, note: string }>({
            query: ({productId, note}) => ({
                url: `/manager/product/unlock/${productId}`,
                method: 'POST',
                body: note,
            }),
        }),

        getManagerProductPage: builder.query<ManagerProductPageResponse, { page: number, size: number }>({
            query: ({page, size}) => `/manager/product/page?page=${page}&size=${size}`,
        }),

        getManagerProductPageByProductName: builder.query<ManagerProductPageResponse, {
            productName: string,
            page: number,
            size: number
        }>({
            query: ({
                        productName,
                        page,
                        size
                    }) => `/manager/product/page/search/${productName}?page=${page}&size=${size}`,
        }),

        getFilterProductPage: builder.query<ProductPageResponse, { filter: string, page: number, size: number }>({
            query: ({ filter, page, size }) => `/product-filter/${filter}?page=${page}&size=${size}`,
        }),

        getProductPageBySearchAndSort: builder.query<ProductPageResponse, { search: string, sort: string, page: number, size: number }>({
            query: ({ search, sort, page, size }) => `/search/product/sort?page=${page}&size=${size}&search=${search}&sort=${sort}`,
        }),


    }),
});

export const {
    useLockProductByProductIdMutation,
    useUnLockProductByProductIdMutation,
    useGetManagerProductPageQuery,
    useGetManagerProductPageByProductNameQuery,
    useGetFilterProductPageQuery,
    useGetProductPageBySearchAndSortQuery,
} = ProductManagerApiSlice;