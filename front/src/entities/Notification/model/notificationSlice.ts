import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { Notification } from "./types.ts";

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const getNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notifications/getNotifications", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:3000/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get notifications",
      );
    }

    return rejectWithValue("Failed to get notifications");
  }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get notifications";
      });
  },
});

export default notificationSlice.reducer;
