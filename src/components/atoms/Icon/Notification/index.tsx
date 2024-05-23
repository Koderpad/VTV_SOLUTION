import { RootState } from "@/redux/store";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";

interface Props {
  className?: string;
}
// NotificationIcon.tsx
const NotificationIcon = ({ className }: Props) => {
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const unreadCount = notifications?.filter((notification) => !notification.seen).length;

  return (
    <div className="relative">
      <IoIosNotificationsOutline className={className} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};
// const NotificationIcon = ({ className }: Props) => {
//   const notifications = useSelector((state: RootState) => state.notification.notifications);
//   const unreadCount = notifications?.filter((notification) => !notification.seen).length;
//
//   return (
//     <div className="relative">
//       <IoIosNotificationsOutline className={className} />
//       {unreadCount > 0 && (
//         <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
//           {unreadCount}
//         </span>
//       )}
//     </div>
//   );
// };

export default NotificationIcon;
