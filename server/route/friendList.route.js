import { Router } from "express";
import { listAllFriends, unfriend } from "../controllers/friendList.controller.js";
import auth from "../middleware/auth.js";

const ListRouter = Router()

ListRouter.get('/friend-list', auth, listAllFriends)
ListRouter.put('/un-friend', auth, unfriend)

export default ListRouter;