import { Server } from "socket.io";

let io; //it is our sockket server

const onlineUsers = new Map(); // Map {"userId"=>"socket id"}

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      // I have loged in, react send my userID
      onlineUsers.set(userId, socket.id); // server remember my userID, I am a sender and I bekome socket id

      console.log("Online:", onlineUsers);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;

export const getOnlineUsers = () => onlineUsers;
