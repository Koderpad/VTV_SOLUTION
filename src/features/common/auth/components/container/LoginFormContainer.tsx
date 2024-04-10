import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginForm } from "../presentational/LoginForm";
import { setCredentials } from "../../../../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../../../../redux/features/auth/authApiSlice";

interface Error {
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

  const handleSubmit_ = async (formData: { [key: string]: any }) => {
    //retrieve username and password from form data
    const username = formData["username"];
    const password = formData["password"];

    try {
      const userData = await login({
        username,
        password,
        fcmToken: username.toString(),
      }).unwrap();
      console.log("userData: ", userData);

      const { access_token, refresh_token, customerDTO } = userData;
      dispatch(setCredentials({ access_token, refresh_token, customerDTO }));

      //Check user role and navigate to the corresponding page
      if (customerDTO.roles.includes("ADMIN")) {
        navigate("/admin", { replace: true });
      } else if (customerDTO.roles.includes("CUSTOMER")) {
        navigate("/home", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
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

  return <LoginForm onSubmit={handleSubmit_} errMsg={errMsg} />;
};
