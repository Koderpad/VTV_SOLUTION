import type { Meta, StoryObj } from "@storybook/react";
import { Text } from ".";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hello word!!!!",
    weight: "bold",
    size: "sm",
  },
};
export const Lon: Story = {
  args: {
    children: "Hello wordd222222!!!!",
    size: "3xl",
  },
};
