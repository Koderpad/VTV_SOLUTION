import type { Meta, StoryObj } from "@storybook/react";

import NotificationIcon from ".";

const meta: Meta<typeof NotificationIcon> = {
  title: "Atoms/Icon/Notification",
  component: NotificationIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "text-red-500 text-3xl",
  },
};
