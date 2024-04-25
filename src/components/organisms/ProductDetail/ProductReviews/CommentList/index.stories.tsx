import { Meta, StoryObj } from "@storybook/react";

import { CommentList } from "./index";

const meta: Meta<typeof CommentList> = {
  title: "Organisms/ProductDetail/ProductReviews/CommentList",
  component: CommentList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CommentListStory: Story = {
  args: {},
  render: (args) => <CommentList {...args} />,
};
