import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { Profile } from "./types";

interface UpdateProfilePayload {
  username: string;
  website: string;
  bio: string;
  avatar: File | null;
}

interface ProfileState {
  profile: Profile | null;
  myProfile: Profile | null;
  isLoading: boolean;
  followLoading: boolean;
  error: string | null;
}

interface ToggleFollowResponse {
  message: string;
  isFollowing: boolean;
}

const initialState: ProfileState = {
  profile: null,
  myProfile: null,
  isLoading: false,
  followLoading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося отримати профіль");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return thunkAPI.rejectWithValue("Невідома помилка");
    }
  },
);

export const fetchProfileByUsername = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("profile/fetchProfileByUsername", async (username, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get<Profile>(
      `http://localhost:3000/profile/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Не вдалося отримати профіль користувача",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося отримати профіль користувача");
  }
});
// export const updateProfile = createAsyncThunk(
//   "profile/updateProfile",
//   async (
//     data: {
//       username: string;
//       bio: string;
//       website: string;
//       avatarUrl: string;
//     },
//     thunkAPI
//   ) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch("http://localhost:3000/profile", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         throw new Error("Не вдалося оновити профіль");
//       }

//       return await response.json();
//     } catch (error) {
//       if (error instanceof Error) {
//         return thunkAPI.rejectWithValue(error.message);
//       }

//       return thunkAPI.rejectWithValue("Невідома помилка");
//     }
//   }
// );
export const updateProfile = createAsyncThunk<
  Profile,
  UpdateProfilePayload,
  { rejectValue: string }
>(
  "profile/updateProfile",
  async ({ username, website, bio, avatar }, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("username", username);
      formData.append("website", website);
      formData.append("bio", bio);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.patch<Profile>(
        "http://localhost:3000/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Не вдалося оновити профіль",
        );
      }

      return thunkAPI.rejectWithValue("Не вдалося оновити профіль");
    }
  },
);

export const toggleFollowByUsername = createAsyncThunk<
  ToggleFollowResponse,
  string,
  { rejectValue: string }
>("profile/toggleFollowByUsername", async (username, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch<ToggleFollowResponse>(
      `http://localhost:3000/profile/${encodeURIComponent(username)}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Не вдалося змінити підписку",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося змінити підписку");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.myProfile = action.payload;
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.myProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfileByUsername.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchProfileByUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })

      .addCase(fetchProfileByUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.profile = null;
        state.error =
          action.payload || "Не вдалося отримати профіль користувача";
      })
      .addCase(toggleFollowByUsername.pending, (state) => {
        state.followLoading = true;
        state.error = null;
      })
      .addCase(toggleFollowByUsername.fulfilled, (state, action) => {
        state.followLoading = false;

        if (!state.profile) {
          return;
        }

        state.profile.isFollowing = action.payload.isFollowing;
      })
      .addCase(toggleFollowByUsername.rejected, (state, action) => {
        state.followLoading = false;
        state.error = action.payload || "Не вдалося змінити підписку";
      });
  },
});

export default profileSlice.reducer;
