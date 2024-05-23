import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationDTO } from "@/utils/DTOs/common/Notification/Response/NotificationResponse";

interface NotificationState {
  notifications: NotificationDTO[];
}

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationDTO[]>) => {
      state.notifications = action.payload;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
