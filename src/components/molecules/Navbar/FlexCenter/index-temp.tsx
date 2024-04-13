import { FC } from "react";
import { Stack } from "../../Stack";
import { BoxProps } from "@/components/atoms/Box";
import { A } from "@/components/atoms/Link/A";

export interface ContentConfig {
  id: string;
  to: string;
  text: string;
  className?: string;
}

export interface FlexCenterProps {
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
      {content.map((item, index) => (
        <div key={item.id} className="flex items-center">
          <A href={item.to} className={`mr-2 ${item.className || ""}`}>
            {item.text}
          </A>
          {index < content.length - 1 && (
            <span className="border-r border-gray-300 h-4 -mr-2"></span>
          )}
        </div>
      ))}
      {children}
    </Stack>
  );
};

// import { FC } from "react";
// import { Stack } from "../../Stack";
// import { BoxProps } from "@/components/atoms/Box";
// import { A } from "@/components/atoms/Link/A";

// export interface ContentConfig {
//   id: string;
//   to: string;
//   text: string;
//   className?: string;
// }

// export interface FlexCenterProps {
//   content: ContentConfig[];
//   children?: React.ReactNode;
//   stackProps?: BoxProps;
// }

// export const FlexCenter: FC<FlexCenterProps> = ({
//   content,
//   children,
//   stackProps,
// }) => {
//   return (
//     <Stack {...stackProps}>
//       {content.map((item) => (
//         <A key={item.id} href={item.to} className={item.className}>
//           {item.text}
//         </A>
//       ))}
//       {children}
//     </Stack>
//   );
// };
