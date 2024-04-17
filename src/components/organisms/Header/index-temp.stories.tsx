import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./index-temp";

const meta: Meta<typeof Header> = {
  title: "Organisms/Header",
  component: Header,
  // parameters: {
  //   layout: "centered",
  // },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const HeaderStory: Story = {
  render: () => <Header />,
};
