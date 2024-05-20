import {apiSlice} from "@/redux/api.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {VoucherResponse} from "@/utils/DTOs/manager/response/VoucherResponse.ts";
import {VoucherSystemRequest} from "@/utils/DTOs/manager/request/VoucherSystemRequest.ts";
import {ListVoucherResponse} from "@/utils/DTOs/manager/response/ListVoucherResponse.ts";

export const VoucherSystemManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addNewVoucherSystem: builder.mutation<VoucherResponse, VoucherSystemRequest>({
            query: (data) => ({
                url: `/manager/voucher/system/add`,
                method: "POST",
                body: data,
            }),
        }),
        getVoucherSystemByVoucherId: builder.query<VoucherResponse, number>({
            query: (voucherId) => `/manager/voucher/system/detail/${voucherId}`,
        }),
        getAllVoucherSystemByUsername: builder.query<ListVoucherResponse, void>({
            query: () => `/manager/voucher/system/get-all/by-username`,
        }),
        getAllVoucherSystem: builder.query<ListVoucherResponse, void>({
            query: () => `/manager/voucher/system/get-all`,
        }),
        getAllVoucherSystemByStatus: builder.query<ListVoucherResponse, string>({
            query: (status) => `/manager/voucher/system/get-all/by-status?status=${status}`,
        }),
        getListVoucherSystemByType: builder.query<ListVoucherResponse, string>({
            query: (type) => `/manager/voucher/system/get-all/system/by-type?type=${type}`,
        }),
        updateVoucherSystem: builder.mutation<VoucherResponse, { voucherId: number, data: VoucherSystemRequest }>({
            query: ({voucherId, data}) => ({
                url: `/manager/voucher/system/update/${voucherId}`,
                method: "PUT",
                body: data,
            }),
        }),
        updateStatusVoucherSystem: builder.mutation<VoucherResponse, { voucherId: number, status: Status }>({
            query: ({voucherId, status}) => ({
                url: `/manager/voucher/system/update-status/${voucherId}?status=${status}`,
                method: "PATCH",
            }),
        }),
    }),
});

export const {
    useAddNewVoucherSystemMutation,
    useGetVoucherSystemByVoucherIdQuery,
    useGetAllVoucherSystemByUsernameQuery,
    useGetAllVoucherSystemQuery,
    useGetAllVoucherSystemByStatusQuery,
    useGetListVoucherSystemByTypeQuery,
    useUpdateVoucherSystemMutation,
    useUpdateStatusVoucherSystemMutation
} = VoucherSystemManagerApiSlice;