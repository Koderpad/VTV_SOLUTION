import { FC } from "react";
import { A } from "@/components/atoms/Link/A";

interface ContentConfig {
  name: string;
  link: string;
}

interface AccountTooltipProps {
  username: string;
}

const content: ContentConfig[] = [
  {
    name: "Tài khoản của tôi",
    link: "/user/account",
  },
  {
    name: "Đơn mua",
    link: "/user/account/history-purchase",
  },
  {
    name: "Đăng xuất",
    link: "/dang-xuat",
  },
];

export const AccountTooltip: FC<AccountTooltipProps> = ({ username }) => {
  return (
    <>
      <div className="px-3 text-left md:cursor-pointer group ">
        <h1 className=" flex justify-between items-center md:pr-0 pr-5 group">
          {username}
        </h1>
        <div className="z-40 relative">
          <div className="absolute z-100 -top-2 -left-24 hidden group-hover:block w-auto max-w-md">
            <div className="py-3">
              <div className="w-4 h-4 left-24 absolute mt-1 bg-white rotate-45"></div>
            </div>
            <div className="py-3 bg-white shadow-lg rounded-lg ">
              <div className="px-4 flex flex-col gap-2">
                {content.map((item, index) => (
                  <div
                    key={index}
                    className=" text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <A
                      href={item.link}
                      className="flex items-center hover:text-blue-600"
                    >
                      {item.name}
                    </A>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
