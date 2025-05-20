import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'

import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import chatRoute from './route/chat.route.js'
import friendRouter from './route/friends.route.js'
import ListRouter from './route/friendList.route.js'
import messRouter from './route/message.route.js'

dotenv.config()
const app = express()
const httpServer = createServer(app)

// -------------------- SOCKET.IO INIT ----------------------
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

// Store mapping of userId => socket.id
const onlineUsers = new Map()

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    // User registers themselves after login
    socket.on('register', (userId) => {
        onlineUsers.set(userId, socket.id)
        console.log(`User ${userId} registered with socket ${socket.id}`)
    })

    // Handle private message
    socket.on('private_message', ({ toUserId, message }) => {
        const toSocketId = onlineUsers.get(toUserId)
        if (toSocketId) {
            io.to(toSocketId).emit('private_message', message)
        }
    })

    // Handle group message
    socket.on('group_message', ({ groupId, message }) => {
        io.to(groupId).emit('group_message', message)
    })

    // Join group room
    socket.on('join_group', (groupId) => {
        socket.join(groupId)
        console.log(`Socket ${socket.id} joined group ${groupId}`)
    })

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`)
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId)
                break
            }
        }
    })
})

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

const PORT = process.env.PORT || 8080

// Basic route
app.get("/", (req, res) => {
    res.json({
        message: "Server is running on port " + PORT
    })
})

// Routes
app.use('/chat/user', userRouter)
app.use('/chat/chat', chatRoute)
app.use('/chat/friendList', ListRouter)
app.use('/chat/friends', friendRouter)
app.use('/chat/message', messRouter)

// Connect DB and start server
connectDB()
httpServer.listen(PORT, () => {
    console.log("Server listening on port", PORT)
})
