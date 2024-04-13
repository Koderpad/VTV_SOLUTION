import { FC } from "react";
import { Stack } from "../../Stack";
import { CustomLink } from "@/components/atoms/Link";
import { BoxProps } from "@/components/atoms/Box";

export interface ContentConfig {
  id: string;
  to: string;
  text: string;
  className?: string;
}

interface FlexCenterProps {
  content: ContentConfig[];
  children?: React.ReactNode;
  stackProps?: BoxProps;
}

export const FlexCenter: FC<FlexCenterProps> = ({
  content,
  children,
  stackProps,
}) => {
  return (
    <Stack {...stackProps}>
      {content.map((item) => (
        <CustomLink key={item.id} to={item.to} className={item.className}>
          {item.text}
        </CustomLink>
      ))}
      {children}
    </Stack>
  );
};
