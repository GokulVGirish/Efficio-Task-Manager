import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"

import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"
import forgotPasswordRouter from "./routes/forgotPassword.js"
import { initializeSocket } from "./socket.io/socketIo.js"


dotenv.config()
const app=express()
const server=http.createServer(app)
export const io=initializeSocket(server)
const port = process.env.PORT || 8001
mongoose.set('strictQuery', true);


app.use(express.json())
app.use(cors())


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("DB Connected")
    }
})


app.use("/api/user", userRouter)
app.use("/api/task", taskRouter)
app.use("/api/forgotPassword", forgotPasswordRouter)






server.listen(port, () => console.log(`Listening on localhost:${port}`))