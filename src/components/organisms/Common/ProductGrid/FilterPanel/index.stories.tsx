import { Meta, StoryObj } from "@storybook/react";

import { FilterPanel } from ".";

const meta: Meta<typeof FilterPanel> = {
  title: "Organisms/ProductGrid/FilterPanel",
  component: FilterPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FilterPanelStory: Story = {
  args: {},
  render: (args) => <FilterPanel {...args} />,
};
