import { Router } from "express";
import { addMembers, changeRole, quitChat, removeMembers } from "../controllers/chat.controller.js";
import auth from "../middleware/auth.js";

const chatRoute = Router()

chatRoute.put('/add-mem', addMembers)
chatRoute.put('/remove-mem', auth, removeMembers)
chatRoute.put('quit-chat', auth, quitChat)
chatRoute.put('/change-role', auth, changeRole)

export default chatRoute