import React, { useState, FormEvent } from "react";
import { FormField } from "@/components/molecules/FormField";
import { Stack } from "@/components/molecules/Stack";
import { InputProps } from "@/components/atoms/Input";
import { BoxProps } from "@/components/atoms/Box";
import { LabelProps } from "@/components/molecules/FormField";
import { Button, ButtonProps } from "@/components/atoms/Button";

//#region FieldConfig
// interface FieldConfig {
//   id: string; // Dùng để xác định field và làm key khi render
//   name: string;
//   type: string;
//   placeholder?: string;
//   label: string;
//   initialValue?: string;
// }

interface FieldConfig {
  id: string;
  inputProps: InputProps;
  labelProps: LabelProps;
  stackProps: BoxProps;
}

// Props cho ReusableForm
interface ReusableFormProps {
  fields: FieldConfig[];
  stackProps?: BoxProps;
  labelProps?: LabelProps;
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
  onSubmit: (data: { [key: string]: any }) => void; // Function xử lý submit
}

export const ReusableForm: React.FC<ReusableFormProps> = ({
  fields,
  stackProps = {},
  labelProps = {},
  inputProps = {},
  buttonProps = {},
  onSubmit,
}) => {
  // Tạo trạng thái ban đầu cho form data dựa vào fields
  const initialFormData = fields.reduce(
    (acc: { [key: string]: any }, field) => {
      acc[field.inputProps.name!] = field.inputProps.value || "";
      return acc;
    },
    {}
  );

  const [formData, setFormData] = useState(initialFormData);

  //#region handleInputChange
  const handleInputChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [name]: e.target.value });
    };

  // Xử lý submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack {...stackProps}>
        {fields.map((field) => (
          <FormField
            key={field.id}
            labelProps={{ ...labelProps, ...field.labelProps }}
            inputProps={{
              ...inputProps,
              ...field.inputProps,
              onChange: handleInputChange(field.inputProps.name!),
            }}
            stackProps={field.stackProps}
          />
        ))}
        {/* <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button> */}
        <Button
          type="submit"
          variant="solid"
          children="Submit"
          {...buttonProps}
        />
      </Stack>
    </form>
  );
};
