import { apiSlice } from "@/redux/api.ts";
import { DeliverResponse } from "@/utils/DTOs/shipping/response/DeliverResponse.ts";

export const DeliverApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDeliverInfo: builder.mutation<DeliverResponse, void>({
            query: () => ({
                url: `shipping/deliver/info`,
                method: "GET",
            }),
        }),


        getDeliverByUsernameRequest: builder.mutation<DeliverResponse, string>({
            query: (username) => ({
                url: `shipping/deliver/get/username/${username}`,
                method: "GET",
            }),
        }),


    }),
});

export const {
    useGetDeliverInfoMutation,
    useGetDeliverByUsernameRequestMutation,
} = DeliverApiSlice;