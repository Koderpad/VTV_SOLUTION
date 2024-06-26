import type { Meta, StoryObj } from "@storybook/react";

import { NavbarWrapper } from "./index-temp";

const meta: Meta<typeof NavbarWrapper> = {
  title: "Organisms/Header/Navbar/NavbarWrapper",
  component: NavbarWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NavbarWrapperStory: Story = {
  render: () => <NavbarWrapper />,
};
