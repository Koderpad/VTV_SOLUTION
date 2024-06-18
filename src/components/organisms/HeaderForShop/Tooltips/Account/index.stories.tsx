import type { Meta, StoryObj } from "@storybook/react";

import { AccountTooltip } from ".";

const meta: Meta<typeof AccountTooltip> = {
  title: "Organisms/Header/Tooltips/Account",
  component: AccountTooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AccountTooltipStory: Story = {
  args: {
    username: "John Doe",
  },
  render: (args) => <AccountTooltip {...args} />,
};
