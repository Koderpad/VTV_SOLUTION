import { Meta, StoryObj } from "@storybook/react";

import { Footer } from "./index";

const meta: Meta<typeof Footer> = {
  title: "Organisms/Footer",
  component: Footer,
  // parameters: {
  //   layout: "centered",
  // },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FooterStory: Story = {
  args: {},
  render: (args) => <Footer {...args} />,
};
