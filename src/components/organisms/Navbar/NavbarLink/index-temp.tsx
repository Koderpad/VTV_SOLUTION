import { NotificationTooltip } from "../../Tooltips/NotificationTooltip/index-temp";
import { A } from "@/components/atoms/Link/A";

export const NavbarLink = () => {
  const content = [
    {
      name: "Thong bao cua hang",
      link: "/thong-bao-cua-hang",
    },
    {
      name: "Thong bao don hang",
      link: "/thong-bao-don-hang",
    },
  ];

  return (
    <ul className="flex gap-2 items-center">
      <li className="">
        <NotificationTooltip content={content} />
      </li>
      <li>
        <A href="/login" className=" rounded hover:bg-gray-200">
          Đăng nhập
        </A>
      </li>
      <li>
        <A href="/register" className=" rounded hover:bg-gray-200">
          Đăng ký
        </A>
      </li>
    </ul>
  );
};
