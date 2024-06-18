import type { Meta, StoryObj } from "@storybook/react";

import { CartTooltip } from "./index-temp";

const meta: Meta<typeof CartTooltip> = {
  title: "Organisms/Header/Tooltips/Cart",
  component: CartTooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: [
      {
        name: "Cart",
        link: "/cart",
      },
      {
        name: "Checkout",
        link: "/checkout",
      },
    ],
  },
  render: (args) => <CartTooltip {...args} />,
};
