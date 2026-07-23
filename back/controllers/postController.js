import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { createNotification } from "../services/NotoficationService.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "username fullname email");

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const createPost = async (req, res) => {
//     try {
//         const { caption } = req.body;

//         const post = await Post.create({
//             user: req.user._id,
//             // image: "",
//             caption
//         });

//         res.status(201).json(post);
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        message: "ID поста не передано",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Пост не знайдено",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Ви не можете видалити чужий пост",
      });
    }
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }
    await post.deleteOne();

    return res.status(200).json({
      message: "Пост успішно видалено",
      postId: post._id,
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { caption = "" } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Оберіть картинку",
      });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "ichgram/posts",
    );

    const post = await Post.create({
      user: req.user._id,
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      caption,
    });

    await post.populate("user", "username fullname email");

    return res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: error.message || "Не вдалося створити пост",
    });
  }
};

export const getPostsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("_id");

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    const posts = await Post.find({
      user: user._id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "username fullname");

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// export const getFeedPosts = async (req, res) => {
//   try {
//     const currentProfile = await Profile.findOne({
//       user: req.user._id,
//     }).select("following");

//     if (!currentProfile) {
//       return res.status(404).json({
//         message: "Профіль не знайдено",
//       });
//     }

//     const posts = await Post.find({
//       user: {
//         $in: currentProfile.following,
//       },
//     })
//       .sort({ createdAt: -1 })
//       .populate("user", "username fullname");

//     return res.status(200).json(posts);
//   } catch (error) {
//     console.error("Get feed posts error:", error);

//     return res.status(500).json({
//       message:
//         error.message ||
//         "Не вдалося отримати стрічку постів",
//     });
//   }
// };
export const getFeedPosts = async (req, res) => {
  try {
    const currentProfile = await Profile.findOne({
      user: req.user._id,
    }).select("following");

    if (!currentProfile) {
      return res.status(404).json({
        message: "Профіль не знайдено",
      });
    }

    const posts = await Post.find({
      user: {
        $in: currentProfile.following,
      },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username fullname")
      .lean();
    const postIds = posts.map((post) => post._id);

    const commentCounts = await Comment.aggregate([
      {
        $match: {
          post: {
            $in: postIds,
          },
        },
      },
      {
        $group: {
          _id: "$post",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const commentCountByPostId = new Map(
      commentCounts.map((item) => [item._id.toString(), item.count]),
    );
    const authorIds = posts.map((post) => post.user?._id).filter(Boolean);

    const authorProfiles = await Profile.find({
      user: {
        $in: authorIds,
      },
    })
      .select("user avatarUrl")
      .lean();

    const avatarByUserId = new Map(
      authorProfiles.map((profile) => [
        profile.user.toString(),
        profile.avatarUrl,
      ]),
    );

    // const postsWithAvatars = posts.map((post) => ({
    //   ...post,
    //   user: {
    //     ...post.user,
    //     avatarUrl:
    //       avatarByUserId.get(post.user._id.toString()) || "",
    //   },
    // }));
    const postsWithAvatars = posts.map((post) => ({
      ...post,

      commentsCount: commentCountByPostId.get(post._id.toString()) || 0,

      user: {
        ...post.user,
        avatarUrl: avatarByUserId.get(post.user._id.toString()) || "",
      },
    }));
    return res.status(200).json(postsWithAvatars);
  } catch (error) {
    console.error("Get feed posts error:", error);

    return res.status(500).json({
      message: error.message || "Не вдалося отримати стрічку постів",
    });
  }
};
// export const getExplorePosts = async (req, res) => {
//   try {
//     const posts = await Post.find({})
//       .sort({ createdAt: -1 })
//       .populate("user", "username fullname email");

//     return res.status(200).json(posts);
//   } catch (error) {
//     console.error("Get explore posts error:", error);

//     return res.status(500).json({
//       message:
//         error.message ||
//         "Не вдалося отримати пости для Explore",
//     });
//   }
// };

export const getExplorePosts = async (req, res) => {
  try {
    const currentProfile = await Profile.findOne({
      user: req.user._id,
    }).select("following avatarUrl");

    if (!currentProfile) {
      return res.status(404).json({
        message: "Профіль не знайдено",
      });
    }

    const excludedUsers = [req.user._id, ...currentProfile.following];

    const posts = await Post.find({
      user: {
        $nin: excludedUsers,
      },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username fullname email");

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Get explore posts error:", error);

    return res.status(500).json({
      message: error.message || "Не вдалося отримати пости для Explore",
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Пост не знайдено",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    if (!alreadyLiked && post.user.toString() !== userId.toString()) {
      await createNotification({
        receiver: post.user,
        sender: userId,
        type: "like",
        post: post._id,
      });
    }
    await post.populate("user", "username fullname email");

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
