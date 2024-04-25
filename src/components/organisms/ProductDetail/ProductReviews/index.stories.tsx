import { Meta, StoryObj } from "@storybook/react";

import { ProductReviews } from "./index";

const meta: Meta<typeof ProductReviews> = {
  title: "Organisms/ProductDetail/ProductReviews",
  component: ProductReviews,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ProductReviewsStory: Story = {
  args: {},
  render: (args) => <ProductReviews {...args} />,
};
