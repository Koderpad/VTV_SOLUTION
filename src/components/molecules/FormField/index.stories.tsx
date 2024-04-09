import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from ".";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelProps: {
      children: "Label",
    },
    inputProps: {
      type: "text",
      placeholder: "Input",
    },
  },
};
