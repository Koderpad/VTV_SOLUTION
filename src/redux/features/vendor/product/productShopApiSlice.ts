import { apiSlice } from "@/redux/api";
import { ProductResponse } from "@/utils/DTOs/vendor/product/Response/ProductResponse";

export const productShopApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation<ProductResponse, FormData>({
      query: (data) => ({
        url: "/vendor/product/add",
        method: "POST",
        body: data,
      }),
      extraOptions: {
        prepareHeaders: (headers: Headers) => {
          headers.set("Content-Type", "multipart/form-data");
          return headers;
        },
      },
    }),
    getListProductByUsername: builder.mutation({
      query: () => ({
        url: `/vendor/product/list`,
        method: "GET",
      }),
    }),

    getListProductShopByCategoryId: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/vendor/product/list/${categoryId}`,
        method: "GET",
      }),
    }),

    getPageProductByUsername: builder.mutation({
      query: ({ page, size }) => ({
        url: `/vendor/product/page`,
        method: "GET",
        params: { page, size },
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetListProductByUsernameMutation,
  useGetListProductShopByCategoryIdMutation,
  useGetPageProductByUsernameMutation,
} = productShopApiSlice;
