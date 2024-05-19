import {apiSlice} from "@/redux/api";
import {CategoryResponse} from "@/utils/DTOs/manager/response/CategoryResponse";

export const categoryManagerApiSlice = apiSlice.injectEndpoints({
            endpoints: (builder) => ({
                addNewCategoryByManager: builder.mutation<CategoryResponse, FormData>({
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
                updateCategoryByManager: builder.mutation<CategoryResponse, { categoryId: string, data: FormData }>({
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
    useAddNewCategoryByManagerMutation,
    useUpdateCategoryByManagerMutation
} = categoryManagerApiSlice;
