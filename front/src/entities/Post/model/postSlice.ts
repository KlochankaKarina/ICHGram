import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface PostUser {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  avatarUrl?: string;
}

export interface Post {
  _id: string;
  user: PostUser | string;
  image: string;
  imagePublicId: string;
  caption: string;
  likes: string[];
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  creating: boolean;
  err: string | null;
}

interface CreatePostPayload {
  caption: string;
  image: File;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  creating: false,
  err: null,
};

export const getPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/getPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Post[]>("http://localhost:3000/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || "Something went wrong",
        );
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  },
);

export const getPostsByUsername = createAsyncThunk<
  Post[],
  string,
  { rejectValue: string }
>("posts/getPostsByUsername", async (username, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get<Post[]>(
      `http://localhost:3000/posts/user/${username}`,
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
          "Не вдалося отримати пости користувача",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося отримати пости користувача");
  }
});

export const createPost = createAsyncThunk<
  Post,
  CreatePostPayload,
  { rejectValue: string }
>("posts/createPost", async ({ caption, image }, thunkAPI) => {
  try {
    const formData = new FormData();

    formData.append("caption", caption);
    formData.append("image", image);

    const response = await axios.post<Post>(
      "http://localhost:3000/posts",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create post",
      );
    }

    return thunkAPI.rejectWithValue("Failed to create post");
  }
});

export const deletedPost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("posts/deletePost", async (postId, thunkAPI) => {
  try {
    await axios.delete("http://localhost:3000/posts", {
      data: { postId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return postId;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete post",
      );
    }

    return thunkAPI.rejectWithValue("Failed to delete post");
  }
});

export const getFeedPosts = createAsyncThunk<
  Post[],
  void,
  { rejectValue: string }
>("posts/getFeedPosts", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get<Post[]>(
      "http://localhost:3000/posts/feed",
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
        error.response?.data?.message || "Не вдалося отримати стрічку постів",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося отримати стрічку постів");
  }
});

export const getExplorePosts = createAsyncThunk<
  Post[],
  void,
  { rejectValue: string }
>("posts/getExplorePosts", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get<Post[]>(
      "http://localhost:3000/posts/explore",
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
        error.response?.data?.message || "Не вдалося отримати пости Explore",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося отримати пости Explore");
  }
});

export const toggleLike = createAsyncThunk<
  Post,
  string,
  { rejectValue: string }
>("posts/toggleLike", async (postId, thunkAPI) => {
  try {
    const response = await axios.patch<Post>(
      `http://localhost:3000/posts/${postId}/like`,
      {},
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
        error.response?.data?.message || "Не вдалося поставити лайк",
      );
    }

    return thunkAPI.rejectWithValue("Не вдалося поставити лайк");
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.err = null;
      })

      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.posts = [];
        state.err = action.payload || "Something went wrong";
      })
      .addCase(createPost.pending, (state) => {
        //state.loading = true;
        state.creating = true;
        state.err = null;
      })

      .addCase(createPost.fulfilled, (state, action) => {
        //state.loading = false;
        state.creating = false;
        state.posts.unshift(action.payload);
      })

      .addCase(createPost.rejected, (state, action) => {
        //state.loading = false;
        state.creating = false;
        state.err = action.payload || "Failed to create post";
      })
      .addCase(deletedPost.pending, (state) => {
        state.err = null;
      })
      .addCase(deletedPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletedPost.rejected, (state, action) => {
        state.err = action.payload || "Failed to delete post";
      })
      .addCase(getPostsByUsername.pending, (state) => {
        state.loading = true;
        state.err = null;
      })

      .addCase(getPostsByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      .addCase(getPostsByUsername.rejected, (state, action) => {
        state.loading = false;
        state.posts = [];
        state.err = action.payload || "Не вдалося отримати пости користувача";
      })
      .addCase(getFeedPosts.pending, (state) => {
        state.loading = true;
        state.err = null;
      })

      .addCase(getFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      .addCase(getFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.posts = [];
        state.err = action.payload || "Не вдалося отримати стрічку постів";
      })
      .addCase(getExplorePosts.pending, (state) => {
        state.loading = true;
        state.err = null;
      })

      .addCase(getExplorePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      .addCase(getExplorePosts.rejected, (state, action) => {
        state.loading = false;
        state.posts = [];
        state.err = action.payload || "Не вдалося отримати пости Explore";
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find(
          (post) => post._id === action.payload._id,
        );

        if (post) {
          post.likes = action.payload.likes;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.err = action.payload || "Не вдалося поставити лайк";
      });
  },
});

export default postsSlice.reducer;
