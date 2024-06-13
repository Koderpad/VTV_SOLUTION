import { Meta, StoryObj } from "@storybook/react";

import { CardItem } from ".";

const meta: Meta<typeof CardItem> = {
  title:
    "Organisms/ProductGrid/SearchItemResult/SearchItemResultItems/CardItem",
  component: CardItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CardItemStory: Story = {
  args: {},
  render: (args) => <CardItem {...args} />,
};
