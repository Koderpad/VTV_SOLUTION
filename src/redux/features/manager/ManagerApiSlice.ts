import {apiSlice} from "@/redux/api.ts";
import {ManagerResponse} from "@/utils/DTOs/manager/response/ManagerResponse.ts";
import {ManagerPageResponse} from "@/utils/DTOs/manager/response/ManagerPageResponse.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";


export const ManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getManagerInfo: builder.query<ManagerResponse, string>({
            query: (username) => `/manager/info?username=${username}`,
        }),


        getManagerPageByUsernameAddedAndStatus: builder.query<ManagerPageResponse, {
            usernameAdded: string;
            status: Status;
            page: number;
            size: number
        }>({
            query: ({usernameAdded, status, page, size}) => `/manager/page/username-added/${usernameAdded}/status/${status}?page=${page}&size=${size}`,
        }),


        getManagerPageByStatus: builder.query<ManagerPageResponse, { status: Status; page: number; size: number }>({
            query: ({status, page, size}) => `/manager/page/status/${status}?page=${page}&size=${size}`,
        }),


        deleteManager: builder.mutation<ManagerResponse, { managerId: number}>({
            query: ({managerId}) => ({
                url: `/manager/delete/${managerId}`,
                method: 'DELETE',
            }),
        }),


        getManagerPage: builder.query<ManagerPageResponse, { size: number; page: number }>({
            query: ({size, page}) => `/manager/page?size=${size}&page=${page}`,
        }),


        findManagerPageByUsername: builder.query<ManagerPageResponse, {
            size: number;
            page: number;
            username: string
        }>({
            query: ({size, page, username}) => `/manager/page/search/${username}?size=${size}&page=${page}`,
        }),
    }),
});
export const {
    useGetManagerInfoQuery,
    useGetManagerPageByUsernameAddedAndStatusQuery,
    useGetManagerPageByStatusQuery,
    useDeleteManagerMutation,
    useGetManagerPageQuery,
    useFindManagerPageByUsernameQuery,
} = ManagerApiSlice;
