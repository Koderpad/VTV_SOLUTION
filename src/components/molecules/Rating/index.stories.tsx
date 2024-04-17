import type { Meta, StoryObj } from "@storybook/react";

import { Rating } from ".";

const meta: Meta<typeof Rating> = {
  title: "Molecules/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Rating5: Story = {
  args: {
    rating: 5,
    starProps: {
      height: "1.5rem",
      width: "1.5rem",
      className: "text-red-500",
    },
  },
};

export const Rating4_5: Story = {
  args: {
    rating: 4.5,
    starProps: {
      //   height: "1rem",
      //   width: "1rem",
      className: "text-blue-500",
    },
  },
};
