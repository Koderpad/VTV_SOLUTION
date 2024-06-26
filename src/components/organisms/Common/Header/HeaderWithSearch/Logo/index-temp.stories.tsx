import type { Meta, StoryObj } from "@storybook/react";

import { Logo } from "./index-temp";

const meta: Meta<typeof Logo> = {
  title: "Organisms/Header/HeaderWithSearch/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Navbar: Story = {
  render: () => <Logo />,
};
