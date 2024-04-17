import { Meta, StoryObj } from "@storybook/react";

import { ProductGrid } from ".";

const meta: Meta<typeof ProductGrid> = {
  title: "Organisms/ProductGrid",
  component: ProductGrid,
  //   parameters: {
  //     layout: "centered",
  //   },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ProductGridStory: Story = {
  args: {},
  render: (args) => <ProductGrid {...args} />,
};
