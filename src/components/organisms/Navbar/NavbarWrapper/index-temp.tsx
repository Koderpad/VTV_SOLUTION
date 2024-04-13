import React from "react";
import {
  FlexCenter,
  FlexCenterProps,
} from "@/components/molecules/Navbar/FlexCenter/index-temp";
import { NavbarLink } from "../NavbarLink/index-temp";

interface NavbarWrapperProps {
  flexCenterContent: FlexCenterProps["content"];
  stackProps?: FlexCenterProps["stackProps"];
}

export const NavbarWrapper: React.FC<NavbarWrapperProps> = ({
  flexCenterContent,
  stackProps,
}) => {
  return (
    <div className="flex justify-between items-center max-w-full px-4 py-2 bg-gray-100">
      <FlexCenter content={flexCenterContent} stackProps={stackProps} />
      <div className="flex-grow"></div> {/* Khoảng trống */}
      <NavbarLink />
    </div>
  );
};
