import { FC, ReactNode } from "react";
import { NotificationTooltip } from "../../Tooltips/NotificationTooltip/index-temp";
import { A } from "@/components/atoms/Link/A";

interface NavbarWrapperProps {
  children?: ReactNode;
}

export const NavbarWrapper: FC<NavbarWrapperProps> = ({ children }) => {
  const content = [
    {
      name: "Thông báo cửa hàng",
      link: "/thong-bao-cua-hang",
    },
    {
      name: "Thông báo đơn hàng",
      link: "/thong-bao-don-hang",
    },
  ];

  return (
    <div className="bg-gray-100 shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex justify-between items-center">
          <li>
            <NotificationTooltip content={content} />
          </li>
          <div className="flex gap-4">
            <li>
              <A href="/login" className="px-4 py-2 rounded hover:bg-gray-200">
                Đăng nhập
              </A>
            </li>
            <li>
              <A
                href="/register"
                className="px-4 py-2 rounded hover:bg-gray-200"
              >
                Đăng ký
              </A>
            </li>
          </div>
        </ul>
        {children}
      </div>
    </div>
  );
};
