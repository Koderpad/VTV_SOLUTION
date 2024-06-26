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
        <div className="z-50 fixed -translate-x-40 hidden group-hover:block max-w-[100rem]">
          {/* <div className="w-4 h-4 absolute right-8 bg-white rotate-45 transform -translate-y-1/2"></div> */}
          <div className="bg-white shadow-lg rounded-lg ">
            <div className="p-5 flex flex-col gap-4">
              {content.map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  <A
                    href={item.link}
                    className="flex items-center gap-2 hover:text-green-600"
                  >
                    {item.name}
                  </A>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
