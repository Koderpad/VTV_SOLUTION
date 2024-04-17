import type { Meta, StoryObj } from "@storybook/react";

import { Star } from ".";

const meta: Meta<typeof Star> = {
  title: "Atoms/Icon/Star",
  component: Star,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    typeStar: "filled",
  },
};

export const Empty: Story = {
  args: {
    typeStar: "empty",
  },
};

export const Half: Story = {
  args: {
    typeStar: "half",
  },
};
