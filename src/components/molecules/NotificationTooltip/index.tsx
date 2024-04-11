import NotificationIcon from "@/components/atoms/Icon/Notification";
// import { IoIosChevronDown, IoIosChevronUp } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

export const NotificationTooltip = () => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");

  return (
    <>
      {links.map((link) => (
        <div>
          <div className="px-3 text-left md:cursor-pointer group">
            <h1
              className="py-7 flex justify-between items-center md:pr-0 pr-5 group"
              //   conditional rendering for mobile
              onClick={() => {
                heading !== link.name ? setHeading(link.name) : setHeading("");
                setSubHeading("");
              }}
            >
              {link.name}
              {/* mobile */}
              {/* <span className="text-xl md:hidden inline">
                {heading === link.name ? <FaChevronUp /> : <FaChevronDown />}
              </span> */}
              {/* desktop */}
              <span className="text-xl md:mt-1 md:ml-2  md:block hidden group-hover:rotate-180 group-hover:-mt-2">
                <FaChevronDown />
              </span>
            </h1>
            {link.submenu && (
              <div className="relative">
                {/* <div className="absolute top-20 hidden group-hover:md:block hover:md:block"> */}
                <div className="absolute -top-10 hidden group-hover:md:block">
                  <div className="py-3">
                    <div
                      className="w-4 h-4 left-3 absolute 
                        mt-1 bg-white rotate-45"
                    ></div>
                  </div>
                  <div className="bg-white -translate-x-2/4 p-5 grid grid-cols-3 gap-10">
                    {link.sublinks.map((mysublinks) => (
                      <div>
                        <h1 className="text-lg font-semibold">
                          {mysublinks.Head}
                        </h1>
                        {mysublinks.sublink.map((slink) => (
                          <li className="text-sm text-gray-600 my-2.5">
                            <a href={slink.link} className="hover:text-primary">
                              {slink.name}
                            </a>
                          </li>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Mobile menus */}
        </div>
      ))}
    </>
  );
};

export const links = [
  {
    name: "Men",
    submenu: true,
    sublinks: [
      {
        Head: "Topwear",
        sublink: [
          { name: "T-shirt", link: "/" },
          { name: "Casual shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
        ],
      },
    ],
  },
  {
    name: "Women",
    submenu: true,
    sublinks: [
      {
        Head: "Topwear",
        sublink: [
          { name: "T-shirt", link: "/" },
          { name: "Casual shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
        ],
      },
      {
        Head: "Bottomwear",
        sublink: [
          { name: "T-shirt", link: "/" },
          { name: "Casual shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
        ],
      },
    ],
  },
  {
    name: "Kid's",
    submenu: true,
    sublinks: [
      {
        Head: "Topwear",
        sublink: [
          { name: "T-shirt", link: "/" },
          { name: "Casual shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
        ],
      },
      {
        Head: "Bottomwear",
        sublink: [
          { name: "T-shirt", link: "/" },
          { name: "Casual shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
        ],
      },
      {
        Head: "innerwear",
        sublink: [
          { name: "T-shirt", link: "/" },
          { name: "Casual shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
        ],
      },

      {
        Head: "sleepwear",
        sublink: [
          { name: "T-shirt", link: "/" },
          { name: "Casual shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
          { name: "formal shirts", link: "/" },
        ],
      },
    ],
  },
];
