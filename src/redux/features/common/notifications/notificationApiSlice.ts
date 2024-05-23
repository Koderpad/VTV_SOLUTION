// notificationSlice.ts
import { NotificationResponse } from "@/utils/DTOs/common/Notification/Response/NotificationResponse";
import { apiSlice } from "../../../api";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListNotification: builder.query<NotificationResponse, { page: number; size: number }>({
      query: ({ page, size }) => `/customer/notification/get-page?page=${page}&size=${size}`,
    }),
    readNotification: builder.mutation({
      query: (id) => ({
        url: `/customer/notification/read/${id}`,
        method: "PUT",
      }),
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/customer/notification/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetListNotificationQuery,
  useReadNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice;
