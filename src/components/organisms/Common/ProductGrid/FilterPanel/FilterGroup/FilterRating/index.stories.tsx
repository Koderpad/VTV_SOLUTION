import { Meta, StoryObj } from "@storybook/react";

import { FilterRating } from ".";

const meta: Meta<typeof FilterRating> = {
  title: "Organisms/ProductGrid/FilterPanel/FilterGroup/FilterRating",
  component: FilterRating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FilterGroupStory: Story = {
  args: {},
  render: (args) => <FilterRating {...args} />,
};
