import {apiSlice} from "@/redux/api.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {PageCustomerResponse} from "@/utils/DTOs/manager/response/PageCustomerResponse.ts";
import {ProfileCustomerResponse} from "@/utils/DTOs/manager/response/ProfileCustomerResponse.ts";

export const CustomerManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        getPageCustomerByStatus: builder.query<PageCustomerResponse, { status: Status, page: number, size: number }>({
            query: ({status, page, size}) => `/manager/customer/page/status/${status}?page=${page}&size=${size}`,
        }),

        getPageCustomerByStatusAndSort: builder.query<PageCustomerResponse, { status: Status, page: number, size: number, sort: string }>({
            query: ({status, page, size, sort}) => `/manager/customer/page/status/${status}/sort/${sort}?page=${page}&size=${size}`,
        }),

        searchPageCustomerByFullNameAndStatus: builder.query<PageCustomerResponse, { search: string, status: Status, page: number, size: number }>({
            query: ({search, status, page, size}) => `/manager/customer/page/search/${search}/status/${status}?page=${page}&size=${size}`,
        }),

        getCustomerDetailByCustomerId: builder.query<ProfileCustomerResponse, number>({
            query: (customerId) => `/manager/customer/detail/${customerId}`,
        }),

    }),
});

export const {
    useGetPageCustomerByStatusQuery,
    useGetPageCustomerByStatusAndSortQuery,
    useSearchPageCustomerByFullNameAndStatusQuery,
    useGetCustomerDetailByCustomerIdQuery
} = CustomerManagerApiSlice;