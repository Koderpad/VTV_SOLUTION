import { ComponentProps, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonStyles = cva(
  [
    "w-full",
    "rounded-md",
    "font-semibold",
    "focus:outline-none",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        solid: "",
        outline: "border-2",
        ghost: "transition-colors duration-300",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
      colorscheme: {
        primary: "text-white bg-blue-500",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        colorscheme: "primary",
        className: "bg-blue-500 hover:bg-blue-600",
      },
      {
        variant: "outline",
        colorscheme: "primary",
        className:
          "text-blue-600 border-blue-500 bg-transparent hover:bg-blue-100",
      },
      {
        variant: "ghost",
        colorscheme: "primary",
        className: "text-blue-600 bg-transparent hover:bg-blue-100",
      },
    ],
    defaultVariants: {
      variant: "solid",
      size: "md",
      colorscheme: "primary",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonStyles>;

// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ variant, size, colorscheme, className, children, ...props }, ref) => {
//     return (
//       <button
//         ref={ref}
//         className={cn(buttonStyles({ variant, size, colorscheme, className }))}
//         {...props}
//       >
//         {children}
//       </button>
//     );
//   }
// );
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, colorscheme, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size, colorscheme, className }))}
        {...props}
      />
    );
  },
);
