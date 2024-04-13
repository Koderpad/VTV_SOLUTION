import React, { AnchorHTMLAttributes } from "react";

// Extend the existing anchor attributes to include any other standard anchor props
interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string; // Ensure className is still required
  children: React.ReactNode;
}

export const A = ({ className, children, ...props }: CustomLinkProps) => {
  return (
    <a className={className} {...props}>
      {children}
    </a>
  );
};
