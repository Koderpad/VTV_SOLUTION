import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RegisterRequest } from "@/utils/DTOs/common/Auth/Request/RegisterRequest";
import { useRegisterMutation } from "@/redux/features/common/auth/authApiSlice";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: {
      gender: true,
    },
  });
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  const [notify, setNotify] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isSuccess && countdown === 0) {
      navigate("/active-account");
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, navigate]);

  const onSubmit = async (data: RegisterRequest) => {
    console.log(data);
    try {
      const dataToSubmit = {
        ...data,
        gender: Boolean(data.gender), // Đảm bảo gender là boolean
      };
      const data_ = await registerUser(dataToSubmit).unwrap();
      setIsSuccess(true);
      setNotify(data_.message);
    } catch (err) {
      // Lỗi được xử lý bởi component
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Đăng Ký</CardTitle>
        <CardDescription>
          Nhập thông tin của bạn để tạo tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              {...register("username", {
                required: "Tên đăng nhập là bắt buộc",
              })}
              disabled={isSuccess}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Mật khẩu là bắt buộc" })}
              disabled={isSuccess}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Địa chỉ email không hợp lệ",
                },
              })}
              disabled={isSuccess}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              onValueChange={(value) => {
                setValue("gender", value === "true");
              }}
              defaultValue="true"
              disabled={isSuccess}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Nam</SelectItem>
                <SelectItem value="false">Nữ</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              {...register("fullName", { required: "Họ và tên là bắt buộc" })}
              disabled={isSuccess}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthday">Ngày sinh</Label>
            <Input
              id="birthday"
              type="date"
              {...register("birthday", { required: "Ngày sinh là bắt buộc" })}
              disabled={isSuccess}
            />
            {errors.birthday && (
              <p className="text-red-500 text-sm">{errors.birthday.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSuccess}
          >
            {isLoading ? "Đang đăng ký..." : "Tạo tài khoản"}
          </Button>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {"data" in error
                ? (error.data as any).message
                : "Đã xảy ra lỗi trong quá trình đăng ký"}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link to="/login" className="text-blue-500 hover:underline">
          Đã có tài khoản? Đăng nhập ngay
        </Link>
      </CardFooter>
      {isSuccess && (
        <Alert className="mt-4">
          <AlertTitle>{notify}</AlertTitle>
          <AlertDescription>
            Bạn sẽ được chuyển hướng đến trang nhập OTP sau {countdown} giây.
            <Link
              to="/active-account"
              className="text-blue-500 hover:underline ml-2"
            >
              Xác thực ngay
            </Link>
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}

// import React from "react";
// import { useForm } from "react-hook-form";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { RegisterRequest } from "@/utils/DTOs/common/Auth/Request/RegisterRequest";
// import { useRegisterMutation } from "@/redux/features/common/auth/authApiSlice";

// export function RegisterForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterRequest>();
//   const [registerUser, { isLoading, error }] = useRegisterMutation();

//   const onSubmit = async (data: RegisterRequest) => {
//     try {
//       await registerUser(data).unwrap();
//       // Xử lý đăng ký thành công (ví dụ: hiển thị thông báo thành công, chuyển hướng)
//     } catch (err) {
//       // Lỗi được xử lý bởi component
//     }
//   };

//   return (
//     <Card className="mx-auto max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-xl">Đăng Ký</CardTitle>
//         <CardDescription>
//           Nhập thông tin của bạn để tạo tài khoản
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="username">Tên đăng nhập</Label>
//             <Input
//               id="username"
//               {...register("username", {
//                 required: "Tên đăng nhập là bắt buộc",
//               })}
//             />
//             {errors.username && (
//               <p className="text-red-500 text-sm">{errors.username.message}</p>
//             )}
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="password">Mật khẩu</Label>
//             <Input
//               id="password"
//               type="password"
//               {...register("password", { required: "Mật khẩu là bắt buộc" })}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm">{errors.password.message}</p>
//             )}
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               {...register("email", {
//                 required: "Email là bắt buộc",
//                 pattern: {
//                   value: /\S+@\S+\.\S+/,
//                   message: "Địa chỉ email không hợp lệ",
//                 },
//               })}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="gender">Giới tính</Label>
//             <Select
//               onValueChange={(value) =>
//                 register("gender").onChange({ target: { value } })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Chọn giới tính" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="true">Nam</SelectItem>
//                 <SelectItem value="false">Nữ</SelectItem>
//               </SelectContent>
//             </Select>
//             {errors.gender && (
//               <p className="text-red-500 text-sm">{errors.gender.message}</p>
//             )}
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="fullName">Họ và tên</Label>
//             <Input
//               id="fullName"
//               {...register("fullName", { required: "Họ và tên là bắt buộc" })}
//             />
//             {errors.fullName && (
//               <p className="text-red-500 text-sm">{errors.fullName.message}</p>
//             )}
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="birthday">Ngày sinh</Label>
//             <Input
//               id="birthday"
//               type="date"
//               {...register("birthday", { required: "Ngày sinh là bắt buộc" })}
//             />
//             {errors.birthday && (
//               <p className="text-red-500 text-sm">{errors.birthday.message}</p>
//             )}
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? "Đang đăng ký..." : "Tạo tài khoản"}
//           </Button>

//           {error && (
//             <p className="text-red-500 text-sm text-center">
//               {"data" in error
//                 ? (error.data as any).message
//                 : "Đã xảy ra lỗi trong quá trình đăng ký"}
//             </p>
//           )}
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
