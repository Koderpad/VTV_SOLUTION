import {apiSlice} from "@/redux/api.ts";
import {BrandResponse} from "@/utils/DTOs/manager/response/BrandResponse.ts";

export const BrandManagerApiSlice = apiSlice.injectEndpoints({
            endpoints: (builder) => ({
                addNewBrand: builder.mutation<BrandResponse, FormData>({
                    query: (data) => ({
                        url: `/manager/brand/add`,
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
                updateBrand: builder.mutation<BrandResponse, { brandId: string, data: FormData }>({
                    query: ({brandId, data}) => ({
                        url: `/manager/brand/update/${brandId}`,
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
    useAddNewBrandMutation,
    useUpdateBrandMutation
} = BrandManagerApiSlice;
