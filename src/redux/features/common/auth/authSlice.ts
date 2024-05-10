import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
// import Cookies from "js-cookie";

// const initialState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   error: "",
// };

interface CustomerDTO {
  customerId: number;
  username: string;
  email: string;
  gender: boolean;
  fullName: string;
  birthday: string; // Consider using Date type if needed
  status: string; // Consider defining a more specific type for status
  roles: string[];
}
const initialState = {
  user: null as CustomerDTO | null, // Chỉ định rằng user có thể là kiểu CustomerDTO hoặc null
  token: null as string | null, // Chỉ rõ kiểu cho token
  isAuthenticated: false,
  error: "",
};
const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, customerDTO } = action.payload;
      localStorage.setItem("token", access_token);

      return {
        ...state,
        token: access_token,
        user: customerDTO,
        isAuthenticated: true,
      };
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.data.token;
      state.user = action.payload.data;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = "";
      localStorage.removeItem("token");

      // Delete refreshToken cookie
      // Cookies.remove("refreshToken");
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, loginSuccess, logOut, updateUser } =
  authReducer.actions;

export default authReducer.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
