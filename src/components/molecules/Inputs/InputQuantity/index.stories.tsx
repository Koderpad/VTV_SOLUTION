import { Meta, StoryObj } from "@storybook/react";

import { InputQuantity } from ".";

const meta: Meta<typeof InputQuantity> = {
  title: "Molecules/Inputs/InputQuantity",
  component: InputQuantity,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const InputQuantityStory: Story = {
  args: {
    quantity: 5,
  },
  render: (args) => <InputQuantity {...args} />,
};
