import { apiSlice } from "@/redux/api";
import { ChangePasswordRequest } from "@/utils/DTOs/common/ProfileCustomer/Request/ChangePasswordRequest";
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
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetVouchersQuery,
} = userApi;
