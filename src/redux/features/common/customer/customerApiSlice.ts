import { apiSlice } from "@/redux/api";
import { AddressStatusRequest } from "@/utils/DTOs/common/ProfileCustomer/Request/AddressStatusRequest";
import { ChangePasswordRequest } from "@/utils/DTOs/common/ProfileCustomer/Request/ChangePasswordRequest";
import { AddressResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/AddressResponse";
import { ListAddressResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ListAddressResponse";
import { ProfileCustomerResponse } from "@/utils/DTOs/common/ProfileCustomer/Response/ProfileCustomerResponse";

interface UserProfile {
  email: string;
  fullName: string;
  birthday: string;
  gender: boolean;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/customer/profile",
    }),
    updateUser: builder.mutation<ProfileCustomerResponse, UserProfile>({
      query: (userProfile) => ({
        url: "/customer/profile",
        method: "PUT",
        body: userProfile,
      }),
    }),
    changePassword: builder.mutation<
      ProfileCustomerResponse,
      ChangePasswordRequest
    >({
      query: (passwords) => ({
        url: "/customer/change-password",
        method: "PATCH",
        body: passwords,
      }),
    }),
    getVouchers: builder.query({
      query: () => "/customer/voucher/list",
    }),
    //=======Address APIs==================
    getAllAddress: builder.query<ListAddressResponse, void>({
      query: () => `/customer/address/all`,
    }),
    addAddress: builder.mutation({
      query: (data) => ({
        url: `/customer/address/add`,
        method: "POST",
        body: data,
      }),
    }),
    updateStatusAddress: builder.mutation<
      AddressResponse,
      AddressStatusRequest
    >({
      query: (data) => ({
        url: `/customer/address/update/status`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateAddress: builder.mutation({
      query: (data) => ({
        url: `/customer/address/update`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetVouchersQuery,
  //=======Address APIs==================
  useGetAllAddressQuery,
  useAddAddressMutation,
  useUpdateStatusAddressMutation,
  useUpdateAddressMutation,
} = userApi;
