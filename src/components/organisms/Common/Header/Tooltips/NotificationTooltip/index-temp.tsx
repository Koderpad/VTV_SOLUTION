import NotificationIcon from "@/components/atoms/Icon/Notification";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  useDeleteNotificationMutation,
  useGetListNotificationQuery,
  useReadNotificationMutation,
} from "@/redux/features/common/notifications/notificationApiSlice";
import { NotificationDTO } from "@/utils/DTOs/common/Notification/Response/NotificationResponse";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

export const NotificationTooltip = () => {
  const notifications: NotificationDTO[] = useSelector(
    (state: RootState) => state.notification.notifications
  );
  const { refetch } = useGetListNotificationQuery({ page: 1, size: 100 });
  const [readNotification] = useReadNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [expandedNotificationId, setExpandedNotificationId] = useState<
    string | null
  >(null);

  const handleNotificationClick = async (notification: NotificationDTO) => {
    if (!notification.seen) {
      await readNotification(notification.notificationId).unwrap();
      refetch();
    }
    if (notification.body.includes("uuid")) {
      const uuid = extractUUIDFromBody(notification.body);
      window.location.href = `http://localhost:5173/user/account/order/${uuid}`;
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId).unwrap();
    refetch();
  };

  const toggleExpandNotification = (notificationId: string) => {
    if (expandedNotificationId === notificationId) {
      console.log("expandedNotificationId", expandedNotificationId);
      setExpandedNotificationId("");
    } else {
      console.log("notificationId", notificationId);
      setExpandedNotificationId(notificationId);
    }
  };

  return (
    <>
      <div className="px-3 text-left md:cursor-pointer group">
        <div className="flex justify-between items-center md:pr-0 pr-5 group">
          Thông Báo!
          <div className="text-xl md:mt-1 md:ml-2 md:block hidden">
            <NotificationIcon />
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-2 right-0 hidden group-hover:block w-screen max-w-md">
            <div className="py-3">
              <div className="w-4 h-4 right-16 absolute mt-1 bg-white rotate-45"></div>
            </div>
            <div className="py-3 bg-white shadow-lg rounded-lg">
              <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
                {notifications?.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`text-sm text-gray-600 hover:bg-gray-100 flex justify-between items-center p-2 rounded ${
                      !notification.seen ? "bg-red-50" : ""
                    }`}
                  >
                    <div
                      onClick={() => handleNotificationClick(notification)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-bold">{notification.title}</div>
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDistanceToNow(new Date(notification.createAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </div>
                      <div className="text-gray-500">
                        {expandedNotificationId === notification.notificationId
                          ? notification.body
                          : truncateText(notification.body, 35)}
                        {notification.body.length > 35 && (
                          <button
                            onClick={() =>
                              toggleExpandNotification(
                                notification.notificationId
                              )
                            }
                            className="ml-1 text-blue-500 hover:underline focus:outline-none"
                          >
                            {expandedNotificationId ===
                            notification.notificationId
                              ? "Thu gọn"
                              : "Xem thêm"}
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteNotification(notification.notificationId)
                      }
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      Xóa
                    </button>
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
// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};
// export const NotificationTooltip = () => {
//   const notifications: NotificationDTO[] = useSelector((state: RootState) => state.notification.notifications);
//   const [readNotification] = useReadNotificationMutation();
//   const [deleteNotification] = useDeleteNotificationMutation();
//
//   const handleNotificationClick = async (notification:NotificationDTO) => {
//     if (!notification.seen) {
//       await readNotification(notification.notificationId).unwrap();
//     }
//     if (notification.body.includes("uuid")) {
//       const uuid = extractUUIDFromBody(notification.body);
//       window.location.href = `http://localhost:5173/user/account/order/${uuid}`;
//     }
//   };
//
//   const handleDeleteNotification = async (notificationId: string) => {
//     await deleteNotification(notificationId).unwrap();
//   };
//
//   return (
//     <>
//       <div className="px-3 text-left md:cursor-pointer group">
//         <div className="flex justify-between items-center md:pr-0 pr-5 group">
//           Thông Báo
//           <div className="text-xl md:mt-1 md:ml-2 md:block hidden">
//             <NotificationIcon />
//           </div>
//         </div>
//         <div className="relative">
//           <div className="absolute -top-2 right-0 hidden group-hover:block w-screen max-w-md">
//             <div className="py-3">
//               <div className="w-4 h-4 right-16 absolute mt-1 bg-white rotate-45"></div>
//             </div>
//             <div className="py-3 bg-white shadow-lg rounded-lg">
//               <div className="p-5 flex flex-col gap-4">
//                 {notifications?.map((notification) => (
//                   <div
//                     key={notification.notificationId}
//                     className="text-sm text-gray-600 hover:text-primary flex justify-between items-center"
//                   >
//                     <div onClick={() => handleNotificationClick(notification)}>
//                       {notification.title}
//                     </div>
//                     <button
//                       onClick={() => handleDeleteNotification(notification.notificationId)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Xóa
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// import { CustomLink } from "@/components/atoms/Link";
// import NotificationIcon from "@/components/atoms/Icon/Notification";
// import { FC } from "react";
// import { A } from "@/components/atoms/Link/A";

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
//             <span className="text-xl md:mt-1 md:ml-2  md:block hidden">
//               <NotificationIcon />
//             </span>
//           </h1>
//           {/* rendering content notif */}
//           <div className="relative">
//             {/* <div className="absolute top-20 hidden group-hover:md:block hover:md:block"> */}
//             <div className="absolute  top-0 right-0 hidden group-hover:md:block  w-screen max-w-md">
//               {/* <div className="py-3">
//                 <div
//                   className="w-4 h-4 left-3 absolute
//                         mt-1 bg-white rotate-45"
//                 ></div>
//               </div> */}
//               <div className="py-3">
//                 <div className="w-4 h-4 left-3 absolute mt-1 bg-white rotate-45"></div>
//               </div>
//               <div className="bg-white flex flex-col p-5 gap-4">
//                 {/* content notif */}
//                 {/* <h1 className="text-lg font-semibold">Thong bao cua hang</h1> */}
//                 {content.map((slink) => (
//                   <div className="text-sm text-gray-600 my-2.5">
//                     <A
//                       href={slink.link}
//                       className="flex flex-row hover:text-primary"
//                     >
//                       {slink.name}
//                     </A>
//                   </div>
//                 ))}
//                 {/* <li className="text-sm text-gray-600 my-2.5">
//                     <CustomLink to={slink.link} className="hover:text-primary">
//                       {slink.name}
//                     </CustomLink>
//                   </li> */}
//                 {/* <h1 className="text-lg font-semibold">Thong bao don hang</h1> */}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Mobile menus */}
//       </div>
//     </>
//   );
// };
