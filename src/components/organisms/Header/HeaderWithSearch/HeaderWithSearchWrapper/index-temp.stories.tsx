import type { Meta, StoryObj } from "@storybook/react";

import { HeaderWithSearchWrapper } from "./index-temp";

const meta: Meta<typeof HeaderWithSearchWrapper> = {
  title: "Organisms/Header/HeaderWithSearch/HeaderWithSearchWrapper",
  component: HeaderWithSearchWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <HeaderWithSearchWrapper />,
};
