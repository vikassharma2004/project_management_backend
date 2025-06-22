import express from "express";
import {
  CreateWorkspaceController,
  getUserAllWorkspace,
  getWorkspaceById,
  DeleteWorkspaceById,
  UpdateWorkspaceController,
  getWorkspaceMembers,
  ChangememberRole,
  getWorkspaceAnalytics,
} from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router();

// create new workspace
workspaceRouter.route("/create/new").post(CreateWorkspaceController);
// update workspace by id
workspaceRouter.route("/update/:id").put(UpdateWorkspaceController);
//change member role
workspaceRouter.route("/change/member-role/:id").put(ChangememberRole);
// workspace delete
workspaceRouter.route("/delete/:id").delete(DeleteWorkspaceById);
// get all workspace
workspaceRouter.route("/all").get(getUserAllWorkspace);
// get workspace by id with members
workspaceRouter.route("/:id").get(getWorkspaceById);
// get all members of workspace
workspaceRouter.route("/members/:id").get(getWorkspaceMembers);

// analytics of workspace
workspaceRouter.route("/analytics/:id").get(getWorkspaceAnalytics);

export default workspaceRouter;
