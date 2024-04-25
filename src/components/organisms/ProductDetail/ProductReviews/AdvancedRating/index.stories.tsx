import { Meta, StoryObj } from "@storybook/react";

import { AdvancedRating } from "./index";

const meta: Meta<typeof AdvancedRating> = {
  title: "Organisms/ProductDetail/ProductReviews/AdvancedRating",
  component: AdvancedRating,
  // parameters: {
  //   layout: "centered",
  // },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AdvancedRatingStory: Story = {
  args: {},
  render: (args) => <AdvancedRating {...args} />,
};
