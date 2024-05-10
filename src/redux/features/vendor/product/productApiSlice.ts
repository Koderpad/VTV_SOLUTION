import { apiSlice } from "@/redux/api";

export const addProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/vendor/product/add",
        method: "POST",
        body: data,
      }),
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

// export const { useAddProductMutation } = addProductApi;

export const {
  useAddProductMutation,
  useGetListProductByUsernameMutation,
  useGetListProductShopByCategoryIdMutation,
  useGetPageProductByUsernameMutation,
} = addProductApi;
