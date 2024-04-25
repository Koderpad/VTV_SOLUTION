import { Meta, StoryObj } from "@storybook/react";

import { RatingComment } from "./index";

const meta: Meta<typeof RatingComment> = {
  title: "Organisms/ProductDetail/ProductReviews/CommentList/RatingComment",
  component: RatingComment,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const RatingCommentStory: Story = {
  args: {},
  render: (args) => <RatingComment {...args} />,
};
