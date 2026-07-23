import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser, IUserResponse } from "../api/api";

interface UserState {
  user: IUser | null;
  token: string | null;
}

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState: UserState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setAuthData: (state, action: PayloadAction<IUserResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUserWithToken: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { setUser, setAuthData, logout, setUserWithToken } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
