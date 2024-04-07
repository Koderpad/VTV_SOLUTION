import { apiSlice } from "../../api";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: "POST",
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
  useGetUserQuery,
  useLogin22Mutation,
} = authApi;
