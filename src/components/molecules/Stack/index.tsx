import { Box, BoxProps } from "@/components/atoms/Box";
import { cn } from "@/utils/cn";

type StackProps = BoxProps;

export const Stack = ({ className, ...props }: StackProps) => {
  return (
    <Box className={cn("flex flex-col items-start", className)} {...props} />
  );
};
