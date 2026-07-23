import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { createNotification } from "../services/NotoficationService.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id,
    }).populate("user", "username fullname email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { username, bio, website, avatarUrl } = req.body;
// await User.findByIdAndUpdate(req.user._id,
//   {
//     username
//   },
//   {
//     new:true,
//     runValidators: true
//   }
// )
//     const profile = await Profile.findOneAndUpdate(
//       {
//         user: req.user._id,
//       },
//       {
//         bio,
//         website,
//         avatarUrl,
//       },
//       {
//         new: true,
//          runValidators: true
//       }
//     ).populate("user", "username email")

//     if(!profile){
//       return res.status(404).json({
//         message: "Profile not found"
//       })
//     }

//     res.status(200).json(profile);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, website } = req.body;

    await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    const profileUpdates = {
      bio,
      website,
    };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "ichgram/avatars",
      );

      profileUpdates.avatarUrl = uploadResult.secure_url;
    }

    const profile = await Profile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      profileUpdates,
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).populate("user", "username fullname email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// export const getProfileByUsername = async (req, res) => {
//   try {
//     const { username } = req.params;

//     const user = await User.findOne({ username }).select(
//       "_id username fullname"
//     );

//     if (!user) {
//       return res.status(404).json({
//         message: "Користувача не знайдено",
//       });
//     }

//     const profile = await Profile.findOne({
//       user: user._id,
//     }).populate("user", "username fullname");

//     if (!profile) {
//       return res.status(404).json({
//         message: "Профіль не знайдено",
//       });
//     }

//     return res.status(200).json(profile);
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
      "_id username fullname",
    );

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    const profile = await Profile.findOne({
      user: user._id,
    }).populate("user", "username fullname");

    if (!profile) {
      return res.status(404).json({
        message: "Профіль не знайдено",
      });
    }

    const isFollowing = profile.followers.some((followerId) =>
      followerId.equals(req.user._id),
    );

    return res.status(200).json({
      ...profile.toObject(),
      isFollowing,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const { username } = req.params;

    const currentUserId = req.user._id;

    const targetUser = await User.findOne({ username }).select("_id username");

    if (!targetUser) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    if (currentUserId.equals(targetUser._id)) {
      return res.status(400).json({
        message: "Не можна підписатися на самого себе",
      });
    }

    const currentProfile = await Profile.findOne({
      user: currentUserId,
    });

    const targetProfile = await Profile.findOne({
      user: targetUser._id,
    });

    if (!currentProfile) {
      return res.status(404).json({
        message: "Ваш профіль не знайдено",
      });
    }

    if (!targetProfile) {
      return res.status(404).json({
        message: "Профіль користувача не знайдено",
      });
    }

    const isFollowing = currentProfile.following.some((userId) =>
      userId.equals(targetUser._id),
    );

    if (isFollowing) {
      currentProfile.following.pull(targetUser._id);
      targetProfile.followers.pull(currentUserId);
    } else {
      currentProfile.following.addToSet(targetUser._id);
      targetProfile.followers.addToSet(currentUserId);
    }

    await currentProfile.save();
    await targetProfile.save();

    if (!isFollowing) {
      // if he starts following me, I receive a notification
      await createNotification({
        receiver: targetUser._id,
        sender: currentUserId,
        type: "follow",
      });
    }
    return res.status(200).json({
      message: isFollowing
        ? "Ви відписалися від користувача"
        : "Ви підписалися на користувача",
      isFollowing: !isFollowing,
      followersCount: targetProfile.followers.length,
      followingCount: targetProfile.following.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Помилка під час зміни підписки",
      error: error.message,
    });
  }
};
