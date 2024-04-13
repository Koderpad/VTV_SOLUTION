import type { Meta, StoryObj } from "@storybook/react";

import { NotificationTooltip } from "./index-temp";

const meta: Meta<typeof NotificationTooltip> = {
  title: "Organisms/Header/Tooltips/NotificationTooltip",
  component: NotificationTooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NotificationTooltipStory: Story = {
  args: {
    content: [
      {
        name: "Thong bao cua hang",
        link: "/thong-bao-cua-hang",
      },
      {
        name: "Thong bao don hang",
        link: "/thong-bao-don-hang",
      },
    ],
  },
  render: (args) => <NotificationTooltip {...args} />,
};
