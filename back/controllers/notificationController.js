import Notification from "../models/Notification.js";
import Profile from "../models/Profile.js";

// export const getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       receiver: req.user._id,
//     })
//       .populate("sender", "username fullname email")
//       .sort({ createdAt: -1 });

//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Get notifications error:", error);

//     res.status(500).json({
//       message: "Failed to get notifications",
//     });
//   }
// };

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
    })
      .populate("sender", "username fullname")
      .populate("post", "image")
      .sort({ createdAt: -1 })
      .lean();

    const senderIds = notifications
      .map((notification) => notification.sender?._id)
      .filter(Boolean);

    const profiles = await Profile.find({
      user: { $in: senderIds },
    })
      .select("user avatarUrl")
      .lean();

    const avatarMap = new Map(
      profiles.map((profile) => [
        profile.user.toString(),
        profile.avatarUrl,
      ]),
    );

    const notificationsWithAvatar = notifications.map(
      (notification) => ({
        ...notification,
        sender: notification.sender
          ? {
              ...notification.sender,
              avatarUrl:
                avatarMap.get(
                  notification.sender._id.toString(),
                ) || "",
            }
          : null,
      }),
    );

    res.status(200).json(notificationsWithAvatar);
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Failed to get notifications",
    });
  }
};