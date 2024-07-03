import { RegisterResponse } from "@/utils/DTOs/common/Auth/Response/RegisterResponse";
import { apiSlice } from "../../../api";
import { RegisterRequest } from "@/utils/DTOs/common/Auth/Request/RegisterRequest";
import { ActiveAccountRequest } from "@/utils/DTOs/common/Auth/Request/ActiveAccountRequest";
import { SendEmailResponse } from "@/utils/DTOs/common/Auth/Response/SendEmailResponse";
import { ForgotPasswordRequest } from "@/utils/DTOs/common/Auth/Request/ForgotPasswordRequest";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: `/auth/register`,
        method: "POST",
        body: data,
      }),
    }),
    activeAccount: builder.mutation<RegisterResponse, ActiveAccountRequest>({
      query: (data) => ({
        url: `/customer/active-account`,
        method: "POST",
        body: data,
      }),
    }),
    activeAccountSendEmail: builder.query<
      SendEmailResponse,
      { username: string }
    >({
      query: ({ username }) => ({
        url: `/customer/active-account/send-email`,
        params: { username },
      }),
      keepUnusedDataFor: 10,
    }),
    forgotPassword: builder.query<SendEmailResponse, { username: string }>({
      query: ({ username }) => ({
        url: `/customer/forgot-password`,
        params: { username },
      }),
      keepUnusedDataFor: 10,
    }),
    resetPassword: builder.mutation<RegisterResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: `/customer/reset-password`,
        method: "PATCH",
        body: data,
      }),
    }),
    getUser: builder.query({ query: () => "/customer/profile" }),
    login22: builder.mutation({
      query: () => ({
        url: "/customer/profile",
        method: "GET",
        // body: data
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useActiveAccountMutation,
  useActiveAccountSendEmailQuery,
  useForgotPasswordQuery,
  useResetPasswordMutation,
  useGetUserQuery,
  useLogin22Mutation,
} = authApi;
