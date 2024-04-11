// NotificationTooltip.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { NotificationTooltip } from ".";

const meta: Meta<typeof NotificationTooltip> = {
  title: "Molecules/NotificationTooltip",
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  component: NotificationTooltip,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
