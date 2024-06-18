import { CustomLink } from "@/components/atoms/Link";
import { NotificationTooltip } from "../../Tooltips/NotificationTooltip";

export const NavbarLink = () => {
  const content:any= [];
  return (
    <ul className="flex gap-2 items-center">
      <li className="">
        <NotificationTooltip content={content} />
      </li>
      <li>
        <CustomLink to="/login" className=" rounded hover:bg-gray-200">
          Đăng nhập
        </CustomLink>
      </li>
      <li>
        <CustomLink to="/register" className=" rounded hover:bg-gray-200">
          Đăng ký
        </CustomLink>
      </li>
    </ul>
  );
};
