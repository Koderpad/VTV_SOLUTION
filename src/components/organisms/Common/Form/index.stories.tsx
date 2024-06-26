import type { Meta, StoryObj } from "@storybook/react";
import { Form } from ".";

const meta: Meta<typeof Form> = {
  title: "Organisms/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSubmit: { action: "submitted" },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const LoginForm: Story = {
  args: {
    fields: [
      {
        id: "1",
        inputProps: {
          name: "username",
          type: "text",
          placeholder: "Username",
          defaultValue: "",
        },
        labelProps: { children: "Username", className: "text-sm", size: "3xl" },
        stackProps: {},
      },
      {
        id: "2",
        inputProps: {
          name: "password",
          type: "password",
          placeholder: "Password",
          defaultValue: "",
        },
        labelProps: { children: "Password" },
        stackProps: {},
      },
    ],
    stackProps: { className: "gap-4" },
    labelProps: { className: "text-sm" },
    inputProps: { className: "px-4 py-2 border" },
    buttonProps: {
      className: "px-4 py-2 text-white bg-primary-500",
      children: "Login",
    },
    // onSubmit: (data) => console.log(data),
  },
  render: (args) => (
    <Form {...args}>
      {/* error message example */}
      <div className="text-red-500 text-sm -mt-4">
        Username or password is incorrect
      </div>
      <div className="text-center">
        <a href="#" className="text-blue-500">
          Forgot password?
        </a>
      </div>
    </Form>
  ),
};

export const RegisterForm: Story = {
  args: {
    fields: [
      {
        id: "1",
        inputProps: {
          name: "fullName",
          type: "text",
          placeholder: "Họ và Tên",
          defaultValue: "",
        },
        labelProps: { children: "Họ và Tên" },
        stackProps: {},
      },
      {
        id: "2",
        inputProps: {
          name: "email",
          type: "email",
          placeholder: "Email",
          defaultValue: "",
        },
        labelProps: { children: "Email" },
        stackProps: {},
      },
      {
        id: "3",
        inputProps: {
          name: "password",
          type: "password",
          placeholder: "Mật khẩu",
          defaultValue: "",
        },
        labelProps: { children: "Mật khẩu" },
        stackProps: {},
      },
      {
        id: "4",
        inputProps: {
          name: "phone",
          type: "tel",
          placeholder: "Số điện thoại",
          defaultValue: "",
        },
        labelProps: { children: "Số điện thoại" },
        stackProps: {},
      },
      {
        id: "5",
        inputProps: {
          name: "address",
          type: "text",
          placeholder: "Địa chỉ",
          defaultValue: "",
        },
        labelProps: { children: "Địa chỉ" },
        stackProps: {},
      },
      {
        id: "6",
        inputProps: {
          name: "birthdate",
          type: "date",
          placeholder: "Ngày sinh",
          defaultValue: "",
        },
        labelProps: { children: "Ngày sinh" },
        stackProps: {},
      },
      {
        id: "7",
        inputProps: {
          name: "gender",
          type: "text",
          placeholder: "Giới tính",
          defaultValue: "",
        },
        labelProps: { children: "Giới tính" },
        stackProps: {},
      },
    ],
    stackProps: { className: "gap-4" },
    labelProps: { className: "text-sm" },
    inputProps: { className: "px-4 py-2 border rounded" },
    buttonProps: {
      className: "mt-4 px-4 py-2 text-white bg-primary-500 rounded",
      children: "Đăng ký",
    },
  },
};

export const ProfileForm: Story = {
  args: {
    fields: [
      {
        id: "1",
        inputProps: {
          name: "firstName",
          type: "text",
          placeholder: "Tên",
          defaultValue: "Nguyen Quoc",
        },
        labelProps: { children: "Tên" },
        stackProps: { className: "w-1/3 flex-grow" },
      },
      {
        id: "2",
        inputProps: {
          name: "lastName",
          type: "text",
          placeholder: "Họ",
          defaultValue: "",
        },
        labelProps: { children: "Họ" },
        stackProps: { className: "w-1/3 flex-grow" },
      },
      {
        id: "3",
        inputProps: {
          name: "phone",
          type: "phone",
          placeholder: "phone",
          defaultValue: "",
        },
        labelProps: { children: "phone" },
        stackProps: { className: "w-1/3" },
      },
      {
        id: "4",
        inputProps: {
          name: "email",
          type: "email",
          placeholder: "email",
          defaultValue: "",
        },
        labelProps: { children: "email" },
        stackProps: { className: "w-auto" },
      },
      {
        id: "5",
        inputProps: {
          name: "address",
          type: "text",
          placeholder: "address",
          defaultValue: "",
        },
        labelProps: { children: "address" },
        stackProps: { className: "w-auto" },
      },
      // Thêm các trường khác tương tự, tuỳ chỉnh layout và className cho phù hợp
    ],
    stackProps: { className: "flex flex-wrap flex-row gap-2" }, // Sử dụng flex wrap và negative margin để cân chỉnh
    labelProps: { className: "text-sm" },
    inputProps: { className: "border rounded w-full" }, // Đảm bảo Input chiếm đầy đủ chiều rộng của FormField
    buttonProps: {
      className: "w-full mt-4 px-4 py-2 text-white bg-primary-500 rounded", // Button chiếm đầy chiều rộng
      children: "Cập nhật thông tin",
    },
  },
};
