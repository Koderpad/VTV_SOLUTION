import type { Meta, StoryObj } from "@storybook/react";

import { SearchBar } from "./index-temp";

const meta: Meta<typeof SearchBar> = {
  title: "Organisms/Header/HeaderWithSearch/Search",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Navbar: Story = {
  render: () => <SearchBar />,
};
