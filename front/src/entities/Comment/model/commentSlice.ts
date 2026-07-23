import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { Comment, CreateCommentPayload } from "./types";

interface CommentsState {
  commentsByPostId: Record<string, Comment[]>;
  loadingByPostId: Record<string, boolean>;
  creatingByPostId: Record<string, boolean>;
  error: string | null;
}

const initialState: CommentsState = {
  commentsByPostId: {},
  loadingByPostId: {},
  creatingByPostId: {},
  error: null,
};

export const getPostComments = createAsyncThunk<
  {
    postId: string;
    comments: Comment[];
  },
  string,
  {
    rejectValue: string;
  }
>("comments/getPostComments", async (postId, thunkAPI) => {
  try {
    const response = await axios.get<Comment[]>(
      `http://localhost:3000/comments/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return {
      postId,
      comments: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Не вдалося отримати коментарі",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося отримати коментарі");
  }
});

export const createComment = createAsyncThunk<
  Comment,
  CreateCommentPayload,
  {
    rejectValue: string;
  }
>("comments/createComment", async ({ postId, text }, thunkAPI) => {
  try {
    const response = await axios.post<Comment>(
      `http://localhost:3000/comments/${postId}`,
      {
        text,
      },
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
        error.response?.data?.message || "Не вдалося створити коментар",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося створити коментар");
  }
});

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getPostComments.pending, (state, action) => {
        const postId = action.meta.arg;

        state.loadingByPostId[postId] = true;
        state.error = null;
      })

      .addCase(getPostComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;

        state.loadingByPostId[postId] = false;
        state.commentsByPostId[postId] = comments;
      })

      .addCase(getPostComments.rejected, (state, action) => {
        const postId = action.meta.arg;

        state.loadingByPostId[postId] = false;
        state.error = action.payload || "Не вдалося отримати коментарі";
      })

      .addCase(createComment.pending, (state, action) => {
        const { postId } = action.meta.arg;

        state.creatingByPostId[postId] = true;
        state.error = null;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        const comment = action.payload;
        const postId = comment.post;

        state.creatingByPostId[postId] = false;

        if (!state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [];
        }

        state.commentsByPostId[postId].push(comment);
      })

      .addCase(createComment.rejected, (state, action) => {
        const { postId } = action.meta.arg;

        state.creatingByPostId[postId] = false;
        state.error = action.payload || "Не вдалося створити коментар";
      });
  },
});

export default commentSlice.reducer;
