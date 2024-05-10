import { apiSlice } from "@/redux/api";

export const productPageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListProductPage: builder.query({
      query: ({ page, size }) => ({
        url: `/product/page/list`,
        params: { page, size },
      }),
    }),
  }),
});

export const { useGetListProductPageQuery, useLazyGetListProductPageQuery } =
  productPageApi;
