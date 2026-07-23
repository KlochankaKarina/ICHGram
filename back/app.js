import dotenv from 'dotenv'
import express from 'express'
import cors from "cors"
import authRouter from "./routes/authRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())
app.get('/', (req, res)=>{
  res.status(200).json({
    message: "Hello from ICHGram"
  })
})
app.use('/auth', authRouter)
app.use('/profile', profileRoutes)
app.use('/posts', postRoutes)
app.use("/comments", commentRoutes)
app.use("/notifications", notificationRoutes)
export default app