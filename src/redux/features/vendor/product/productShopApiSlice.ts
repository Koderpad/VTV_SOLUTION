import { apiSlice } from "@/redux/api";
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
  }),
});

export const {
  useAddProductMutation,
  useGetPageProductByStatusQuery,
  useUpdateProductStatusMutation,
  useRestoreProductMutation,
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
//   }),
// });

// export const { useAddProductMutation, useGetPageProductByStatusQuery } =
//   productShopApiSlice;
