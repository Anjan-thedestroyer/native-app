import { Router } from "express";
import { acceptReq, deleteReqById, getAllByIDReq, rejectFriendReq, sendFriendReq } from "../controllers/friends.controller.js";
import auth from "../middleware/auth.js";
const friendRouter = Router();

friendRouter.post('/send-req', auth, sendFriendReq)
friendRouter.get('/get-req', auth, getAllByIDReq)
friendRouter.put('/remove-req', auth, deleteReqById)
friendRouter.put('/accept-req', auth, acceptReq)
friendRouter.put('/reject-req', auth, rejectFriendReq)

export default friendRouter