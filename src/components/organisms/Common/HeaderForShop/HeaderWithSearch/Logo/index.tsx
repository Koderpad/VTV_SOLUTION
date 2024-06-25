import { FC } from "react";

interface LogoProps {
  className?: string;
  children?: React.ReactNode;
}
export const Logo: FC<LogoProps> = ({ className, children }) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <a href="/" className="mr-2">
          <img src="/Logo.webp" alt="logo" className="h-8" />
        </a>
        {children}
        {/* <span className="text-lg font-semibold">Logo</span> */}
      </div>
    </div>
  );
};
