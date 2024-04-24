import { Meta, StoryObj } from "@storybook/react";

import { ProductDetailTemplate } from ".";

const meta: Meta<typeof ProductDetailTemplate> = {
  title: "Templates/ProductDetailTemplate",
  component: ProductDetailTemplate,
  // parameters: {
  //   layout: "centered",
  // },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ProductDetail: Story = {
  args: {},
  render: (args) => <ProductDetailTemplate {...args} />,
};
