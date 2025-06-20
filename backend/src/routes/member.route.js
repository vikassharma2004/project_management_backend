import express from "express";
import { joinWorkspaceController } from "../controllers/member.controller.js";
const MemberRouter = express.Router();




MemberRouter.route("/workspace/:inviteCode/join").post(joinWorkspaceController)








export default MemberRouter