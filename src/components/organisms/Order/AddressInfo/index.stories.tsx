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
  args: {
    address: {
      fullName: "Nguyễn Văn A",
      phone: "0123456789",
      province: "Hà Nội",
      district: "Ba Đình",
      ward: "Cống Vị",
    },
  },
  render: (args) => <AddressInfo {...args} />,
};
