import {
  FieldConfig,
  Form,
  FormProps,
} from "@/components/organisms/Common/Form";
import { FC } from "react";

interface LoginFormProps extends Omit<FormProps, "fields" | "onSubmit"> {
  onSubmit: (data: { [key: string]: any }) => void;
  errMsg?: string;
}

export const LoginForm: FC<LoginFormProps> = ({
  onSubmit,
  errMsg,
  stackProps,
  labelProps,
  inputProps,
  buttonProps,
}) => {
  const loginFields: FieldConfig[] = [
    {
      id: "username",
      inputProps: {
        name: "username",
        type: "text",
        placeholder: "Email/Số điện thoại/Tên đăng nhập",
        defaultValue: "",
      },
      labelProps: { children: "Email/Số điện thoại/Tên đăng nhập" },
      stackProps: {},
    },
    {
      id: "password",
      inputProps: {
        name: "password",
        type: "password",
        placeholder: "Mật khẩu",
        defaultValue: "",
      },
      labelProps: { children: "Mật khẩu" },
      stackProps: { className: "w-full" },
    },
  ];

  labelProps = { ...labelProps, className: "block text-xl font-semibold mb-2" };
  inputProps = {
    ...inputProps,
    className: "w-full p-2 border border-gray-300",
  };

  return (
    <Form
      fields={loginFields}
      onSubmit={onSubmit}
      stackProps={stackProps}
      labelProps={labelProps}
      inputProps={inputProps}
      buttonProps={buttonProps}
    >
      {errMsg && (
        <div
          className="
      text-xl text-red-500
      border border-red-500
      mb-4
      p-2
      mt-4
      "
        >
          {errMsg}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <button type="submit" className="bg-orange-400 text-white p-2 rounded">
          Register
        </button>
        <a href="#" className="text-xs text-blue-600">
          Quên mật khẩu?
        </a>
      </div>
    </Form>
  );
};
