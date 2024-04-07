import { apiSlice } from "@/redux/api";

export const productPageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListProductPage: builder.mutation({
      query: ({ page, size }) => ({
        url: `/product/page/list`,
        method: "GET",
        params: { page, size },
      }),
    }),

    getListProductPageByCategoryId: builder.mutation({
      query: ({ page, size, categoryId }) => ({
        url: `/product/page/category/${categoryId}`,
        method: "GET",
        params: { page, size },
      }),
    }),

    getListProductPageByShopId: builder.mutation({
      query: ({ page, size, shopId }) => ({
        url: `/product/page/shop/${shopId}`,
        method: "GET",
        params: { page, size },
      }),
    }),

    getListBestSellingProductsPageByShopId: builder.mutation({
      query: ({ page, size, shopId }) => ({
        url: `/product/page/shop/${shopId}/best-selling`,
        method: "GET",
        params: { page, size },
      }),
    }),

    getListNewProductsPageByShopId: builder.mutation({
      query: ({ page, size, shopId }) => ({
        url: `/product/page/shop/${shopId}/new`,
        method: "GET",
        params: { page, size },
      }),
    }),

    getListProductsPagePriceRange: builder.mutation({
      query: ({ page, size, minPrice, maxPrice }) => ({
        url: `/product/page/price-range`,
        method: "GET",
        params: { page, size, minPrice, maxPrice },
      }),
    }),

    getListProductsPageByShopAndPriceRange: builder.mutation({
      query: ({ page, size, shopId, minPrice, maxPrice }) => ({
        url: `/product/page/shop/${shopId}/price-range`,
        method: "GET",
        params: { page, size, minPrice, maxPrice },
      }),
    }),

    getListProductsPageByShopAndPriceRangeSort: builder.mutation({
      query: ({ page, size, shopId, minPrice, maxPrice, sort }) => ({
        url: `/product/page/shop/${shopId}/price-range/sort`,
        method: "GET",
        params: { page, size, minPrice, maxPrice, sort },
      }),
    }),

    getListProductsPageByShopSearchSort: builder.mutation({
      query: ({ page, size, search, sort }) => ({
        url: `/product/page/search/sort`,
        method: "GET",
        params: { page, size, search, sort },
      }),
    }),

    getListProductsPageByShopSearchPriceSort: builder.mutation({
      query: ({ page, size, search, sort, minPrice, maxPrice }) => ({
        url: `/product/page/search/price/sort`,
        method: "GET",
        params: { page, size, search, sort, minPrice, maxPrice },
      }),
    }),
  }),
});

export const {
  useGetListProductPageByCategoryIdMutation,
  useGetListProductPageMutation,
  useGetListProductPageByShopIdMutation,
  useGetListBestSellingProductsPageByShopIdMutation,
  useGetListNewProductsPageByShopIdMutation,
  useGetListProductsPagePriceRangeMutation,
  useGetListProductsPageByShopAndPriceRangeMutation,
  useGetListProductsPageByShopAndPriceRangeSortMutation,
  useGetListProductsPageByShopSearchSortMutation,
  useGetListProductsPageByShopSearchPriceSortMutation,
} = productPageApi;
