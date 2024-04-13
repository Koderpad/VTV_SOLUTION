import type { Meta, StoryObj } from "@storybook/react";

import CartIcon from ".";

const meta: Meta<typeof CartIcon> = {
  title: "Atoms/Icon/Cart",
  component: CartIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "text-red-500 text-3xl",
  },
};
