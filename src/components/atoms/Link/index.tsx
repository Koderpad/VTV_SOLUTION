import { Link, LinkProps } from "react-router-dom";

interface CustomLinkProps extends LinkProps {
  className?: string;
  children?: React.ReactNode;
}

export const CustomLink = ({
  className,
  children,
  ...props
}: CustomLinkProps) => {
  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  );
};
