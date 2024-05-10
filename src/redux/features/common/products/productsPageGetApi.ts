import { apiSlice } from "@/redux/api";

export const productsPageGetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewFavoriteProduct: builder.mutation({
      query: ({ productId }) => ({
        url: `/customer/favorite-product/add`,
        method: "POST",
        params: { productId },
      }),
    }),
    deleteFavoriteProduct: builder.mutation({
      query: ({ favoriteProductId }) => ({
        url: `/customer/favorite-product/delete/${favoriteProductId}`,
        method: "DELETE",
      }),
    }),
    getProductPageList: builder.query({
      query: ({ page, size }) => ({
        url: `/product/page/list`,
        method: "GET",
        params: { page, size },
      }),
    }),
  }),
});

export const {
  useAddNewFavoriteProductMutation,
  useGetProductPageListQuery,
  useDeleteFavoriteProductMutation,
} = productsPageGetApi;
