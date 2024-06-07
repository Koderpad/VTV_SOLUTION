import {apiSlice} from "@/redux/api.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {CustomerPageResponse} from "@/utils/DTOs/manager/response/CustomerPageResponse.ts";
import {ProfileCustomerResponse} from "@/utils/DTOs/manager/response/ProfileCustomerResponse.ts";
import {StatisticsCustomersResponse} from "@/utils/DTOs/manager/response/StatisticsCustomersResponse.ts";

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

        statisticsCustomersByDateAndStatus: builder.query<StatisticsCustomersResponse, { startDate: string, endDate: string }>({
            query: ({ startDate, endDate }) => `/manager/revenue/statistics/customers?startDate=${startDate}&endDate=${endDate}`,
        }),

    }),
});

export const {
    useGetPageCustomerByStatusQuery,
    useGetPageCustomerByStatusAndSortQuery,
    useSearchPageCustomerByFullNameAndStatusQuery,
    useGetCustomerDetailByCustomerIdQuery,
    useStatisticsCustomersByDateAndStatusQuery,
} = CustomerManagerApiSlice;