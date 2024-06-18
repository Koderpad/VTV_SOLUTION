import { FC } from "react";
import { Stack } from "@/components/molecules/Stack";
import { BoxProps } from "@/components/atoms/Box";
import { CustomLink } from "@/components/atoms/Link";

export interface FlexCenterProps {
  children?: React.ReactNode;
  stackProps?: BoxProps;
}

export const FlexCenter: FC<FlexCenterProps> = ({ children, stackProps }) => {
  const content = [
    {
      id: "1",
      to: "/vendor",
      text: "Kênh Người Bán",
    },
    { id: "2", to: "/vendor/reg", text: "Trở thành Người bán VTV" },
    // { id: "3", to: "/blog", text: "Blog" },
    // { id: "4", to: "/faq", text: "FAQ" },
  ];

  return (
    <Stack {...stackProps}>
      {content.map((item, index) => (
        <div key={item.id} className="flex items-center">
          {/* <A href={item.to} className={`mr-2 ${item.className || ""}`}> */}
          <CustomLink to={item.to} className={`mr-2`}>
            {item.text}
          </CustomLink>
          {index < content.length - 1 && (
            <span className="border-r border-gray-300 h-4 -mr-2"></span>
          )}
        </div>
      ))}
      {children}
    </Stack>
  );
};
