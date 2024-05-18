import {apiSlice} from "@/redux/api";
import {CategoryResponse} from "@/utils/DTOs/manager/Category/Response/CategoryResponse";

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
    }),
});

export const {useAddNewCategoryByManagerMutation} = categoryManagerApiSlice;

