import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Profile from "../models/Profile.js";
import { createNotification } from "../services/NotoficationService.js";

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "Введіть текст коментаря",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Пост не знайдено",
      });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      text: text.trim(),
    });

    if (post.user.toString() !== req.user._id.toString()) {
      await createNotification({
        receiver: post.user,
        sender: req.user._id,
        type: "comment",
        post: post._id,
        comment: comment._id,
      });
    }

    await comment.populate("user", "username fullname email");

    const profile = await Profile.findOne({
      user: req.user._id,
    }).select("avatarUrl");

    const commentObject = comment.toObject();

    return res.status(201).json({
      ...commentObject,
      user: {
        ...commentObject.user,
        avatarUrl: profile?.avatarUrl || "",
      },
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      message: error.message || "Не вдалося створити коментар",
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Пост не знайдено",
      });
    }

    const comments = await Comment.find({
      post: postId,
    })
      .select("-__v")
      .sort({ createdAt: 1 })
      .populate("user", "username fullname email")
      .lean();

    const userIds = comments
      .map((comment) => comment.user?._id)
      .filter(Boolean);

    const profiles = await Profile.find({
      user: {
        $in: userIds,
      },
    })
      .select("user avatarUrl")
      .lean();

    const avatarByUserId = new Map(
      profiles.map((profile) => [profile.user.toString(), profile.avatarUrl]),
    );

    const commentsWithAvatars = comments.map((comment) => ({
      ...comment,
      user: {
        ...comment.user,
        avatarUrl: avatarByUserId.get(comment.user._id.toString()) || "",
      },
    }));

    return res.status(200).json(commentsWithAvatars);
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      message: error.message || "Не вдалося отримати коментарі",
    });
  }
};
