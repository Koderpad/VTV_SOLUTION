import { apiSlice } from "@/redux/api";
import { ListCategoryShopResponse } from "@/utils/DTOs/common/ShopDetail/Response/ListCategoryShopResponse";
import { ShopDetailResponse } from "@/utils/DTOs/common/ShopDetail/Response/ShopDetailResponse";

// Add new APIs to fetch data from specific endpoints
export const shopApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShopById: builder.query<ShopDetailResponse, number>({
      query: (shopId) => ({
        url: `/shop/${shopId}`,
        method: "GET",
      }),
    }),
    getCategoryListByShopId: builder.query<ListCategoryShopResponse, number>({
      query: (shopId) => ({
        url: `/category-shop/get-list/shop-id/${shopId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetShopByIdQuery, useGetCategoryListByShopIdQuery } =
  shopApiSlice;
