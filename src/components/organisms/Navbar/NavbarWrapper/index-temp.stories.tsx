import type { Meta, StoryObj } from "@storybook/react";

import { NavbarWrapper } from "./index-temp";

const meta: Meta<typeof NavbarWrapper> = {
  title: "Organisms/Navbar/NavbarWrapper",
  component: NavbarWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NavbarWrapperStory: Story = {
  args: {
    flexCenterContent: [
      {
        id: "1",
        to: "/",
        text: "Kênh Người Bán",
        className: "text-black hover:underline",
      },
      {
        id: "2",
        to: "/about",
        text: "Trở thành Người bán Shopee",
      },
      {
        id: "3",
        to: "/contact",
        text: "Kết nối",
      },
    ],
    stackProps: { className: "flex flex-row gap-4" },
  },
  render: (args) => <NavbarWrapper {...args} />,
};
