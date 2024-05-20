import {apiSlice} from "@/redux/api.ts";
import {CategoryResponse} from "@/utils/DTOs/manager/response/CategoryResponse.ts";

export const CategoryManagerApiSlice = apiSlice.injectEndpoints({
            endpoints: (builder) => ({
                addNewCategory: builder.mutation<CategoryResponse, FormData>({
                    query: (data) => ({
                        url: `/manager/category/add`,
                        method: "POST",
                        body: data,
                    }),
                    extraOptions: {
                        prepareHeaders: (headers: Headers) => {
                            headers.set('Content-Type', 'multipart/form-data');
                            return headers;
                        },
                    },
                }),
                updateCategory: builder.mutation<CategoryResponse, { categoryId: string, data: FormData }>({
                    query: ({categoryId, data}) => ({
                        url: `/manager/category/update/${categoryId}`,
                        method: "POST",
                        body: data,
                    }),
                    extraOptions: {
                        prepareHeaders: (headers: Headers) => {
                            headers.set('Content-Type', 'multipart/form-data');
                            return headers;
                        },
                    },
                }),
            }),
        }
    )
;

export const {
    useAddNewCategoryMutation,
    useUpdateCategoryMutation
} = CategoryManagerApiSlice;
