import { Router } from "express";
import { deleteMessage, getMessages, sendMessage, updateMessageStatus } from "../controllers/message.controller.js";
import auth from "../middleware/auth.js";

const messRouter = Router()

messRouter.post('/send-mess', auth, sendMessage)
messRouter.get('/get-mess', auth, getMessages)
messRouter.put('/update-mess', auth, updateMessageStatus)
messRouter.put('/delete-mess', auth, deleteMessage)

export default messRouter