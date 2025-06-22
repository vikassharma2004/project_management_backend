import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.route("/current").get(getCurrentUser);
export default userRouter;
