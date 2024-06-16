import {apiSlice} from "@/redux/api.ts";
import {UpdateTransportProviderRequest} from "@/utils/DTOs/shipping/request/UpdateTransportProviderRequest.ts";
import {TransportProviderResponse} from "@/utils/DTOs/shipping/response/TransportProviderResponse.ts";

export const TransportProviderApiSlice = apiSlice.injectEndpoints({
        endpoints: (builder) => ({


                updateInformationTransportProvider: builder.mutation<TransportProviderResponse, {
                    transportProviderId: string,
                    data: UpdateTransportProviderRequest
                }>({
                    query: ({transportProviderId, data}) => ({
                        url: `/shipping/transport-provider/update/${transportProviderId}`,
                        method: "PUT",
                        body: data,
                    }),
                }),

                getTransportProviderByUsername: builder.query<TransportProviderResponse, void>({
                    query: () => ({
                        url: `/shipping/transport-provider/detail`,
                        method: "GET",
                    }),
                }),
            }
        )
    })
;

export const {
    useUpdateInformationTransportProviderMutation,
    useGetTransportProviderByUsernameQuery

} = TransportProviderApiSlice;
