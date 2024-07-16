import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginForm } from "../presentational/LoginForm";
import { setCredentials } from "../../../../../redux/features/common/auth/authSlice";
import { useLoginMutation } from "../../../../../redux/features/common/auth/authApiSlice";
import {
  requestForToken,
  requestForPermission,
} from "../../../../../config/fcm";

interface LoginError extends Error {
  status?: number;
}

export const LoginFormContainer = () => {
  const errRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [errMsg, setErrMsg] = useState<string>("");
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit_ = async (formData: { [key: string]: string }) => {
    const { username, password } = formData;

    try {
      await requestForPermission();
      const fcmToken = await requestForToken();

      const userData = await login({ username, password, fcmToken }).unwrap();
      const { access_token, refresh_token, customerDTO } = userData;

      dispatch(setCredentials({ access_token, refresh_token, customerDTO }));

      navigateBasedOnRole(customerDTO.roles);
    } catch (err) {
      handleLoginError(err);
    }
  };

  const navigateBasedOnRole = (roles: string[]) => {
    // if (roles.includes("MANAGER")) {
    //   navigate("/manager", { replace: true });
    // } else if (roles.includes("CUSTOMER")) {
    //   navigate("/home", { replace: true });
    // } else {
    //   navigate(from, { replace: true });
    // }
    if (roles.includes("MANAGER")) {
      navigate("/manager", { replace: true });
    } else if (roles.includes("PROVIDER")) {
      navigate("/provider", { replace: true });
    } else if (roles.includes("DELIVER_MANAGER")) {
      navigate("/deliver_manager", { replace: true });
    } else if (roles.includes("DELIVER")) {
      navigate("/deliver", { replace: true });
    } else if (roles.includes("VENDOR")) {
      navigate("/vendor", { replace: true });
      return;
    } else if (roles.includes("CUSTOMER")) {
      navigate("/home", { replace: true });
    }
  };

  const handleLoginError = (error: any) => {
    if (!error.status) {
      setErrMsg("Không có phản hồi từ máy chủ");
    }
    setErrMsg(error.data.message);
    errRef.current?.focus();
  };

  return <LoginForm onSubmit={handleSubmit_} errMsg={errMsg} />;
};
