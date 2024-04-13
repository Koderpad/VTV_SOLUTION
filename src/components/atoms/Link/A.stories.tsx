import type { Meta, StoryObj } from "@storybook/react";

import { A } from "./A";

const meta: Meta<typeof A> = {
  title: "Atoms/Link",
  component: A,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <A to="/login" className="bg-red-600 hover:text-slate-500 text-white">
      Kênh Người Bán
    </A>
  ),
};
