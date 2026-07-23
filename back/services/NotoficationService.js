import Notification from "../models/Notification.js";
import { getIO, getOnlineUsers } from "../socket/socket.js";

export const createNotification = async ({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) => {
  const notification = await Notification.create({
    receiver,
    sender,
    type,
    post,
    comment,
  });

  await notification.populate("sender", "username fullname email");

  const io = getIO(); //get server

  const onlineUsers = getOnlineUsers(); // {karina->socket 123, vika->socket 234}

  const receiverSocketId = onlineUsers.get(
    receiver.toString(), // we get receivers socket id from vika("234")
  );

  if (receiverSocketId) {
    io.to(receiverSocketId) // find socket "234"
      .emit(
        // send messege to receiver with socket "234"
        "notification:new",
        notification,
      );
  }

  return notification;
};
