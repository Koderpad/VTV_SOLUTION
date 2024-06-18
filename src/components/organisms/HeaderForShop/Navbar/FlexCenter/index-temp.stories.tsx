import type { Meta, StoryObj } from "@storybook/react";

import { FlexCenter } from "./index-temp";

const meta: Meta<typeof FlexCenter> = {
  title: "Organisms/Header/Navbar/FlexCenter",
  component: FlexCenter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Navbar: Story = {
  args: {
    stackProps: { className: "flex flex-row gap-4" },
  },
  render: (args) => <FlexCenter {...args} />,
};
