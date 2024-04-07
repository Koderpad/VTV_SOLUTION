import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { setCredentials } from "../../../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../../../redux/features/auth/authApiSlice";
import React from "react";

interface Error {
  status?: number;
}

export const LoginForm = () => {
  const errRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({
        username,
        password,
        fcmToken: username.toString(),
      }).unwrap();
      console.log("userData: ", userData);
      const { access_token, refresh_token, customerDTO } = userData;
      dispatch(setCredentials({ access_token, refresh_token, customerDTO }));

      setUsername("");
      setPassword("");
      //Check user role and navigate to the corresponding page
      if (customerDTO.roles.includes("ADMIN")) {
        navigate("/admin", { replace: true });
      } else if (customerDTO.roles.includes("CUSTOMER")) {
        navigate("/home", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
      // navigate(from, { replace: true });

      // navigate("/user/account");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const error = err as Error;
      if (!error.status) {
        // isLoading: true until timeout occurs
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current?.focus();
    }
    console.log("DONE HandleSubmit");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
          Email/Số điện thoại/Tên đăng nhập
        </label>
        <input
          type="text"
          id="email"
          className="border w-full p-2 rounded"
          value={username}
          onChange={handleUserInput}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-semibold mb-2">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          className="border w-full p-2 rounded"
          value={password}
          onChange={handlePwdInput}
        />
      </div>
      {errMsg && <div>{errMsg}</div>}
      <div className="flex items-center justify-between mb-4">
        <button type="submit" className="bg-orange-400 text-white p-2 rounded">
          ĐĂNG NHẬP
        </button>
        <a href="#" className="text-xs text-blue-600">
          Quên mật khẩu?
        </a>
      </div>
      <div className="flex items-center justify-center mb-4">
        <span className="text-sm">Hoặc</span>
      </div>
      <div className="flex gap-4">
        <button className="bg-blue-800 text-white p-2 rounded w-full">
          Facebook
        </button>
        <button className="bg-red-600 text-white p-2 rounded w-full">
          Google
        </button>
      </div>
      <div className="text-center mt-4">
        <span className="text-sm">Bạn mới biết đến Shoppee?</span>
        <a href="#" className="text-blue-600 text-sm">
          {" "}
          Đăng ký
        </a>
      </div>
    </form>
  );
};
