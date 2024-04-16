import { Meta, StoryObj } from "@storybook/react";

import { HomePageTemplate } from "./index-temp";

const meta: Meta<typeof HomePageTemplate> = {
  title: "Templates/HomePageTemplate",
  component: HomePageTemplate,
  // parameters: {
  //   layout: "centered",
  // },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const HomePage: Story = {
  args: {},
  render: (args) => <HomePageTemplate {...args} />,
};
