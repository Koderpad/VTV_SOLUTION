import { apiSlice } from "@/redux/api";
import { FavoriteProductResponse } from "@/utils/DTOs/common/FavoriteProduct/Response/FavoriteProductResponse";
import { ListFavoriteProductResponse } from "@/utils/DTOs/common/FavoriteProduct/Response/ListFavoriteProductResponse";

export const favoriteProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listFavoriteProducts: builder.query<ListFavoriteProductResponse, void>({
      query: () => ({
        url: "/customer/favorite-product/list",
        method: "GET",
      }),
    }),

    checkFavoriteProductExists: builder.query<FavoriteProductResponse, number>({
      query: (productId) => ({
        url: `/customer/favorite-product/check-exist/${productId}`,
        method: "GET",
      }),
    }),

    addFavoriteProduct: builder.mutation<FavoriteProductResponse, number>({
      query: (productId) => ({
        url: `/customer/favorite-product/add/${productId}`,
        method: "POST",
      }),
    }),

    deleteFavoriteProduct: builder.mutation<FavoriteProductResponse, number>({
      query: (favoriteProductId) => ({
        url: `/customer/favorite-product/delete/${favoriteProductId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useListFavoriteProductsQuery,
  useCheckFavoriteProductExistsQuery,
  useAddFavoriteProductMutation,
  useDeleteFavoriteProductMutation,
} = favoriteProductApiSlice;
