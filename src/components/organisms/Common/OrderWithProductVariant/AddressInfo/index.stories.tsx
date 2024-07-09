import type { Meta, StoryObj } from "@storybook/react";

import { AddressInfo } from ".";

const meta: Meta<typeof AddressInfo> = {
  title: "Organisms/Order/AddressInfo",
  component: AddressInfo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // args: {
  //   address: {
  //     fullName: "Nguyễn Văn A",
  //     phone: "0123456789",
  //     provinceFullName: "Hà Nội",
  //     districtFullName: "Ba Đình",
  //     wardFullName: "Cống Vị",
  //   },
  // },
  // render: (args) => <AddressInfo {...args} />,
  args: {
    address: {
      addressId: 1,
      provinceName: "HN",
      provinceFullName: "Hà Nội",
      districtName: "BD",
      districtFullName: "Ba Đình",
      wardName: "CV",
      wardFullName: "Cống Vị",
      fullAddress: "Số 1, ngõ 1, phố 1",
      fullName: "Nguyễn Văn A",
      phone: "0123456789",
      status: "active",
      wardCode: "123",
    },
  },
};
