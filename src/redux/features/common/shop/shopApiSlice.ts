import { apiSlice } from "@/redux/api";
import { CategoryShopResponse } from "@/utils/DTOs/common/ShopDetail/Response/CategoryShopResponse";
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
    getShopCusById: builder.query<ShopDetailResponse, number>({
      query: (shopId) => ({
        url: `/shop/${shopId}`,
        method: "GET",
      }),
    }),
    getShopByUsername: builder.query<ShopDetailResponse, string>({
      query: (username) => ({
        url: `/shop/username/${username}`,
        method: "GET",
      }),
    }),
    getCategoryListByShopId: builder.query<ListCategoryShopResponse, number>({
      query: (shopId) => ({
        url: `/category-shop/get-list/shop-id/${shopId}`,
        method: "GET",
      }),
    }),
    getListProductByCategoryShopId: builder.query<CategoryShopResponse, number>(
      {
        query: (shopId) => ({
          url: `/category-shop/category-shop-id/${shopId}`,
          method: "GET",
        }),
      }
    ),
  }),
});

export const {
  useGetShopByIdQuery,
  useLazyGetShopCusByIdQuery,
  useGetShopByUsernameQuery,
  useGetCategoryListByShopIdQuery,
  useGetListProductByCategoryShopIdQuery,
} = shopApiSlice;
