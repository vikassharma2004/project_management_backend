import express from "express";
import { CreateWorkspaceController,getUserAllWorkspace,getWorkspaceById ,getWorkspaceMembers,ChangememberRole,getWorkspaceAnalytics} from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router();

// create new workspace
workspaceRouter.route("/create/new").post(CreateWorkspaceController)
//change member role 
workspaceRouter.route("/change/member-role").put(ChangememberRole)
// get all workspace
workspaceRouter.route("/all").get(getUserAllWorkspace)
// get workspace by id with members
workspaceRouter.route("/:id").get(getWorkspaceById)
// get all members of workspace
workspaceRouter.route("/members/:id").get(getWorkspaceMembers)

// analytics of workspace
workspaceRouter.route("/analytics/:id").get(getWorkspaceAnalytics)






export default workspaceRouter