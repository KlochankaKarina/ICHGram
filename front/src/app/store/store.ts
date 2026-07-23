import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../../entities/User/model/userSlice";
import profileReducer  from "../../entities/Profile/model/profileSlice";
import postReducer from "../../entities/Post/model/postSlice"
import commentsReducer from "../../entities/Comment/model/commentSlice"
import notificationReducer from "../../entities/Notification/model/notificationSlice"

export const store = configureStore({
    reducer: {
      user: userReducer,
      profile: profileReducer,
      posts: postReducer,
      comments: commentsReducer,
      notifications: notificationReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch