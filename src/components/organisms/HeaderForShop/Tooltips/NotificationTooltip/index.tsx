import { FC } from "react";
import NotificationIcon from "@/components/atoms/Icon/Notification";
import { CustomLink } from "@/components/atoms/Link";

interface ContentConfig {
  name: string;
  link: string;
}

interface NotificationTooltipProps {
  content: ContentConfig[];
}

export const NotificationTooltip: FC<NotificationTooltipProps> = ({
  content,
}) => {
  return (
    <>
      <div className="px-3 text-left md:cursor-pointer group">
        <h1 className="py-7 flex justify-between items-center md:pr-0 pr-5 group">
          Thông Báo
          <span className="text-xl md:mt-1 md:ml-2 md:block hidden">
            <NotificationIcon />
          </span>
        </h1>
        <div className="relative">
          <div className="absolute -top-10 right-0 hidden group-hover:block w-screen max-w-md">
            <div className="py-3">
              <div className="w-4 h-4 right-16 absolute mt-1 bg-white rotate-45"></div>
            </div>
            <div className="py-3 bg-white shadow-lg rounded-lg">
              <div className="p-5 flex flex-col gap-4">
                {content.map((item, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    <CustomLink
                      to={item.link}
                      className="flex items-center gap-2"
                    >
                      {item.name}
                    </CustomLink>
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

// import { CustomLink } from "@/components/atoms/Link";
// import NotificationIcon from "@/components/atoms/Icon/Notification";
// import { FC } from "react";

// interface ContentConfig {
//   name: string;
//   link: string;
// }

// interface NotificationTooltipProps {
//   content: ContentConfig[];
// }

// export const NotificationTooltip: FC<NotificationTooltipProps> = ({
//   content,
// }) => {
//   return (
//     <>
//       <div>
//         <div className="px-3 text-left md:cursor-pointer group">
//           <h1 className="py-7 flex justify-between items-center md:pr-0 pr-5 group">
//             Thong bao
//             <span className="text-xl md:mt-1 md:ml-2  md:block hidden group-hover:rotate-180 group-hover:-mt-2">
//               <NotificationIcon />
//             </span>
//           </h1>
//           {/* rendering content notif */}
//           <div className="relative">
//             {/* <div className="absolute top-20 hidden group-hover:md:block hover:md:block"> */}
//             <div className="absolute -top-10 hidden group-hover:md:block">
//               <div className="py-3">
//                 <div
//                   className="w-4 h-4 left-3 absolute
//                         mt-1 bg-white rotate-45"
//                 ></div>
//               </div>
//               <div className="bg-white -translate-x-2/4 p-5 grid grid-cols-3 gap-10">
//                 {/* content notif */}
//                 <div>
//                   {/* <h1 className="text-lg font-semibold">Thong bao cua hang</h1> */}
//                   {content.map((slink) => (
//                     <div className="text-sm text-gray-600 my-2.5">
//                       <CustomLink
//                         to={slink.link}
//                         className="hover:text-primary"
//                       >
//                         {slink.name}
//                       </CustomLink>
//                     </div>
//                   ))}
//                   {/* <li className="text-sm text-gray-600 my-2.5">
//                     <CustomLink to={slink.link} className="hover:text-primary">
//                       {slink.name}
//                     </CustomLink>
//                   </li> */}
//                   {/* <h1 className="text-lg font-semibold">Thong bao don hang</h1> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Mobile menus */}
//       </div>
//     </>
//   );
// };
