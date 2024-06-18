import type { Meta, StoryObj } from "@storybook/react";

import { NavbarLink } from "./index-temp";

const meta: Meta<typeof NavbarLink> = {
  title: "Organisms/Header/Navbar/NavbarLink",
  component: NavbarLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NavbarLinkStory: Story = {
  render: () => <NavbarLink />,
};
