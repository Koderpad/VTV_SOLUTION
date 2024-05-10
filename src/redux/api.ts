import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { BASE_URL_VTC } from "../constants/urls";
import { logOut, setCredentials } from "./features/common/auth/authSlice";

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL_VTC,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      // Get the current user from the state
      const customerDTO = (api.getState() as RootState).auth.user;

      const access_token = refreshResult.data
        ? (refreshResult.data as { [key: string]: string })["accessToken"]
        : null;

      // Dispatch an action to update the state with the new data
      api.dispatch(setCredentials({ access_token, customerDTO }));

      // Retry the original query with the new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("logOut()");
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
