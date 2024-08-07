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
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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

  const handleNotification = (notification: string) => {
    const uuidRegex =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = notification.match(uuidRegex);

    if (match) {
      const uuid = match[0];
      navigate(`/user/account/order/${uuid}`);
    } else {
      console.error("UUID không được tìm thấy trong thông báo");
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
                      <button
                        type="button"
                        onClick={() => handleNotification(notification.body)}
                        className="text-blue-600 hover:text-orange-500"
                      >{`>>Đơn hàng`}</button>
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
