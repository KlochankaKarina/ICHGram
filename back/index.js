import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import http from "http";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 3000;

// const start = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error.message);
//     process.exit(1);
//   }
// };

// start();


const server = http.createServer(app);
initSocket(server)

const start = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
