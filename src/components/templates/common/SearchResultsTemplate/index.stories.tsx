import { Meta, StoryObj } from "@storybook/react";

import { SearchResultsTemplate } from ".";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof SearchResultsTemplate> = {
  title: "Templates/SearchResultsTemplate",
  component: SearchResultsTemplate,
  // parameters: {
  //   layout: "centered",
  // },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchResults: Story = {
  args: {},
  render: (args) => <SearchResultsTemplate {...args} />,
};
