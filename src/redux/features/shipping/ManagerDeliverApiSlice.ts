import { apiSlice } from "@/redux/api.ts";
import { DeliverRequest } from "@/utils/DTOs/shipping/request/DeliverRequest.ts";
import { DeliverResponse } from "@/utils/DTOs/shipping/response/DeliverResponse.ts";
import { ListDeliverResponse } from "@/utils/DTOs/shipping/response/ListDeliverResponse.ts";
import { Status } from "@/utils/DTOs/extra/Status.ts";
import { TypeWork } from "@/utils/DTOs/extra/TypeWork.ts";
import {UpdateDeliverWorkRequest} from "@/utils/DTOs/shipping/request/UpdateDeliverWorkRequest.ts";

export const ManagerDeliverApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addNewDeliverManagerByProvider: builder.mutation<DeliverResponse, DeliverRequest>({
            query: (data) => ({
                url: `shipping/transport-provider/manager/deliver/add-manager`,
                method: "POST",
                body: data,
            }),
        }),

        addNewDeliverByManager: builder.mutation<DeliverResponse, DeliverRequest>({
            query: (data) => ({
                url: `shipping/transport-provider/manager/deliver/add`,
                method: "POST",
                body: data,
            }),
        }),

        updateDeliverWork: builder.mutation<DeliverResponse, { deliverId: number; data: UpdateDeliverWorkRequest }>({
            query: ({ deliverId, data }) => ({
                url: `shipping/transport-provider/manager/deliver/update-work/${deliverId}`,
                method: "PUT",
                body: data,
            }),
        }),

        updateStatusDeliver: builder.mutation<DeliverResponse, { deliverId: number, status: Status }>({
            query: ({ deliverId, status }) => ({
                url: `shipping/transport-provider/manager/deliver/${deliverId}/status/${status}`,
                method: "PUT",
            }),
        }),

        getDeliverByDeliverId: builder.query<DeliverResponse, number>({
            query: (deliverId) => ({
                url: `shipping/transport-provider/manager/deliver/get/${deliverId}`,
                method: "GET",
            }),
        }),

        getListDeliverByStatus: builder.query<ListDeliverResponse, Status>({
            query: (status) => ({
                url: `shipping/transport-provider/manager/deliver/list/status/${status}`,
                method: "GET",
            }),
        }),

        getListDeliverByStatusAndTypeWork: builder.query<
            ListDeliverResponse,
            { status: Status; typeWork: TypeWork }
        >({
            query: ({ status, typeWork }) => ({
                url: `shipping/transport-provider/manager/deliver/list/status/${status}/type-work/${typeWork}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useAddNewDeliverManagerByProviderMutation,
    useAddNewDeliverByManagerMutation,
    useUpdateDeliverWorkMutation,
    useUpdateStatusDeliverMutation,
    useGetDeliverByDeliverIdQuery,
    useGetListDeliverByStatusQuery,
    useGetListDeliverByStatusAndTypeWorkQuery,
} = ManagerDeliverApiSlice;