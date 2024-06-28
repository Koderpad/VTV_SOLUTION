import { apiSlice } from "@/redux/api";
import { CategoryShopResponse } from "@/utils/DTOs/vendor/categories/Response/CategoryShopResponse";
import { ListCategoryShopResponse } from "@/utils/DTOs/vendor/categories/Response/ListCategoryShopResponse";

export interface ResponseClass {
  status: string;
  message: string;
  code: number;
}

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategoryShop: builder.query<ListCategoryShopResponse, void>({
      query: () => ({
        url: "/vendor/category-shop/get-all",
        method: "GET",
      }),
    }),

    addCategoryShop: builder.mutation<CategoryShopResponse, FormData>({
      query: (data) => ({
        url: "/vendor/category-shop/add",
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

    updateCategoryShop: builder.mutation<
      CategoryShopResponse,
      { categoryShopId: number; data: FormData }
    >({
      query: ({ categoryShopId, data }) => ({
        url: `/vendor/category-shop/update/${categoryShopId}`,
        method: "PUT",
        body: data,
      }),
      extraOptions: {
        prepareHeaders: (headers: Headers) => {
          headers.set("Content-Type", "multipart/form-data");
          return headers;
        },
      },
    }),

    deleteCategoryShop: builder.mutation<ResponseClass, number>({
      query: (categoryShopId) => ({
        url: `/vendor/category-shop/delete/${categoryShopId}`,
        method: "DELETE",
      }),
    }),

    addProductsToCategory: builder.mutation<
      CategoryShopResponse,
      { categoryShopId: number; productIds: number[] }
    >({
      query: ({ categoryShopId, productIds }) => ({
        url: `/vendor/category-shop/id/${categoryShopId}/add-product`,
        method: "PUT",
        body: productIds,
      }),
    }),

    deleteProductsFromCategory: builder.mutation<
      CategoryShopResponse,
      { categoryShopId: number; productIds: number[] }
    >({
      query: ({ categoryShopId, productIds }) => ({
        url: `/vendor/category-shop/id/${categoryShopId}/delete-product`,
        method: "DELETE",
        body: productIds,
      }),
    }),
  }),
});

export const {
  useGetAllCategoryShopQuery,
  useAddCategoryShopMutation,
  useUpdateCategoryShopMutation,
  useDeleteCategoryShopMutation,
  useAddProductsToCategoryMutation,
  useDeleteProductsFromCategoryMutation,
} = categoriesApiSlice;
