import { apiSlice } from "@/redux/api";
import { ChangePriceProductsByPercentRequest } from "@/utils/DTOs/vendor/product/Request/ChangePriceProductsByPercentRequest";
import { ChangePriceProductsRequest } from "@/utils/DTOs/vendor/product/Request/ChangePriceProductsRequest";
import { ListProductResponse } from "@/utils/DTOs/vendor/product/Response/ListProductResponse";
import { ProductPageResponse } from "@/utils/DTOs/vendor/product/Response/ProductPageResponse";
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
    getPageProductByStatus: builder.query<
      ProductPageResponse,
      { page: number; size: number; status: string }
    >({
      query: ({ page, size, status }) => ({
        url: `/vendor/product/page/status/${status}`,
        method: "GET",
        params: { page, size },
      }),
    }),
    updateProductStatus: builder.mutation<
      ProductResponse,
      { productId: number; status: string }
    >({
      query: ({ productId, status }) => ({
        url: `/vendor/product/update/${productId}/status/${status}`,
        method: "PATCH",
      }),
    }),
    restoreProduct: builder.mutation<ProductResponse, number>({
      query: (productId) => ({
        url: `/vendor/product/restore/${productId}`,
        method: "PATCH",
      }),
    }),
    updateProduct: builder.mutation<
      ProductResponse,
      { productId: number; data: FormData }
    >({
      query: ({ productId, data }) => ({
        url: `/vendor/product/update/${productId}`,
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
    updatePriceByProductIds: builder.mutation<
      ListProductResponse,
      ChangePriceProductsRequest
    >({
      query: (data) => ({
        url: `/vendor/product/update/changes/price`,
        method: "POST",
        body: data,
      }),
    }),
    updatePercentPriceByProductIds: builder.mutation<
      ListProductResponse,
      ChangePriceProductsByPercentRequest
    >({
      query: (data) => ({
        url: `/vendor/product/update/changes/price/percent`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetPageProductByStatusQuery,
  useUpdateProductStatusMutation,
  useRestoreProductMutation,
  useUpdateProductMutation,
  useUpdatePriceByProductIdsMutation,
  useUpdatePercentPriceByProductIdsMutation,
} = productShopApiSlice;

// import { apiSlice } from "@/redux/api";
// import { ProductPageResponse } from "@/utils/DTOs/vendor/product/Response/ProductPageResponse";
// import { ProductResponse } from "@/utils/DTOs/vendor/product/Response/ProductResponse";

// export const productShopApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     addProduct: builder.mutation<ProductResponse, FormData>({
//       query: (data) => ({
//         url: "/vendor/product/add",
//         method: "POST",
//         body: data,
//       }),
//       extraOptions: {
//         prepareHeaders: (headers: Headers) => {
//           headers.set("Content-Type", "multipart/form-data");
//           return headers;
//         },
//       },
//     }),
//     getPageProductByStatus: builder.query<
//       ProductPageResponse,
//       { page: number; size: number; status: string }
//     >({
//       query: ({ page, size, status }) => ({
//         url: `/vendor/product/page/status/${status}`,
//         method: "GET",
//         params: { page, size },
//       }),
//     }),
//     updateProductStatus: builder.mutation<
//       ProductResponse,
//       { productId: number; status: string }
//     >({
//       query: ({ productId, status }) => ({
//         url: `/vendor/product/update/${productId}/status/${status}`,
//         method: "PATCH",
//       }),
//     }),
//     restoreProduct: builder.mutation<ProductResponse, number>({
//       query: (productId) => ({
//         url: `/vendor/product/restore/${productId}`,
//         method: "PATCH",
//       }),
//     }),
//   }),
// });

// export const {
//   useAddProductMutation,
//   useGetPageProductByStatusQuery,
//   useUpdateProductStatusMutation,
//   useRestoreProductMutation,
// } = productShopApiSlice;
