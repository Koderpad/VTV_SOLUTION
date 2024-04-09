import { BoxProps } from "@/components/atoms/Box";
import { Stack } from "../Stack";
import { Text, textStyles } from "@/components/atoms/Text";
import { Input, InputProps } from "@/components/atoms/Input";
import { PolymorphicComponentPropsWithRef } from "@/utils/types";
import { VariantProps } from "class-variance-authority";

export type LabelProps = PolymorphicComponentPropsWithRef<
  "label",
  VariantProps<typeof textStyles>
>;

type FormFieldProps = {
  labelProps: LabelProps;
  inputProps: InputProps;
  stackProps: BoxProps;
};

export const FormField: React.FC<FormFieldProps> = ({
  labelProps,
  inputProps,
  stackProps,
}) => {
  return (
    <Stack {...stackProps}>
      <Text as="label" {...labelProps} />
      <Input {...inputProps} />
    </Stack>
  );
};
