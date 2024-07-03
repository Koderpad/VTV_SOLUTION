import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useForgotPasswordQuery,
  useResetPasswordMutation,
} from "@/redux/features/common/auth/authApiSlice";

export const ForgotPasswordForm = () => {
  const [countdown, setCountdown] = useState(300); // 5 phút
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [shouldFetchOTP, setShouldFetchOTP] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      username: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const username = watch("username");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    data: sendEmailData,
    isFetching: isResending,
    isError: isSendEmailError,
    error: sendEmailError,
  } = useForgotPasswordQuery(
    { username },
    {
      skip: !shouldFetchOTP,
    }
  );

  const startCountdown = useCallback(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cleanup = startCountdown();
    return cleanup;
  }, [countdown, startCountdown]);

  useEffect(() => {
    if (sendEmailData) {
      toast.success(sendEmailData.message);
      setShouldFetchOTP(false);
      setCountdown(300); // Reset to 5 minutes
    }
  }, [sendEmailData]);

  useEffect(() => {
    if (isSendEmailError) {
      toast.error(
        (sendEmailError as any)?.data?.message || "Không thể gửi mã OTP"
      );
      setShouldFetchOTP(false);
    }
  }, [isSendEmailError, sendEmailError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setInterval(() => {
        setRedirectCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [successMessage, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await resetPassword({
        username: data.username,
        otp: data.otp,
        newPassword: data.newPassword,
      }).unwrap();
      setSuccessMessage(result.message);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(
        err.data?.message || "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu"
      );
    }
  };

  const handleGetOTP = () => {
    if (!username) {
      toast.error("Vui lòng nhập tên đăng nhập trước khi lấy mã OTP");
      return;
    }
    setShouldFetchOTP(true);
    setErrorMessage("");
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Quên Mật Khẩu</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex items-center">
          <div className="flex-grow mr-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Vui lòng nhập tên đăng nhập" }}
              render={({ field }) => (
                <Input {...field} id="username" className="mt-1" />
              )}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleGetOTP}
            disabled={isResending || countdown > 289 || successMessage !== ""}
            className="mt-6"
          >
            {isResending ? "Đang gửi..." : "Lấy Mã OTP"}
          </Button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            Mã OTP
          </label>
          <Controller
            name="otp"
            control={control}
            rules={{
              required: "Vui lòng nhập mã OTP",
              minLength: { value: 6, message: "Mã OTP phải có 6 chữ số" },
            }}
            render={({ field: { onChange, value } }) => (
              <InputOTP maxLength={6} value={value} onChange={onChange}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu mới
          </label>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "Vui lòng nhập mật khẩu mới",
              minLength: {
                value: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                id="newPassword"
                className="mt-1"
              />
            )}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Xác nhận mật khẩu
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Vui lòng xác nhận mật khẩu",
              validate: (value) =>
                value === getValues("newPassword") ||
                "Mật khẩu xác nhận không khớp",
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                id="confirmPassword"
                className="mt-1"
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <Button
            type="submit"
            disabled={isLoading || countdown === 0 || successMessage !== ""}
          >
            {isLoading ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
          </Button>
        </div>
        {countdown > 0 && (
          <p className="text-sm text-gray-500">
            Thời gian còn lại: {Math.floor(countdown / 60)}:
            {countdown % 60 < 10 ? "0" : ""}
            {countdown % 60}
          </p>
        )}
      </form>
      {successMessage && (
        <Alert className="mt-4">
          <AlertDescription>
            {successMessage}
            <br />
            {redirectCountdown > 0 &&
              `Chuyển hướng đến trang đăng nhập sau ${redirectCountdown} giây...`}
            <br />
          </AlertDescription>
        </Alert>
      )}
      <Button
        onClick={() => navigate("/login")}
        className="mt-2 bg-transparent text-black border border-solid border-black hover:bg-black hover:text-white active:bg-black active:text-white font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      >
        Đến Trang Đăng Nhập Ngay
      </Button>
      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <Toaster />
    </div>
  );
};
