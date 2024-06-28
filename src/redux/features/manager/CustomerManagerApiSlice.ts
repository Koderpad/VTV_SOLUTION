import {apiSlice} from "@/redux/api.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {CustomerPageResponse} from "@/utils/DTOs/manager/response/CustomerPageResponse.ts";
import {ProfileCustomerResponse} from "@/utils/DTOs/manager/response/ProfileCustomerResponse.ts";

export const CustomerManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        getPageCustomerByStatus: builder.query<CustomerPageResponse, { status: Status, page: number, size: number }>({
            query: ({status, page, size}) => `/manager/customer/page/status/${status}?page=${page}&size=${size}`,
        }),

        getPageCustomerByStatusAndSort: builder.query<CustomerPageResponse, { status: Status, page: number, size: number, sort: string }>({
            query: ({status, page, size, sort}) => `/manager/customer/page/status/${status}/sort/${sort}?page=${page}&size=${size}`,
        }),

        searchPageCustomerByFullNameAndStatus: builder.query<CustomerPageResponse, { search: string, status: Status, page: number, size: number }>({
            query: ({search, status, page, size}) => `/manager/customer/page/search/${search}/status/${status}?page=${page}&size=${size}`,
        }),

        getCustomerDetailByCustomerId: builder.query<ProfileCustomerResponse, number>({
            query: (customerId) => `/manager/customer/detail/${customerId}`,
        }),


        getProfileCustomer: builder.mutation<ProfileCustomerResponse, void>({
            query: () => `/customer/profile`,
        }),



    }),
});

export const {
    useGetPageCustomerByStatusQuery,
    useGetPageCustomerByStatusAndSortQuery,
    useSearchPageCustomerByFullNameAndStatusQuery,
    useGetCustomerDetailByCustomerIdQuery,
    useGetProfileCustomerMutation,
} = CustomerManagerApiSlice;