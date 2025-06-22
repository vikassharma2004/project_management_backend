import express from "express"
import { createProjectController,getAllProjectsInWorkspaceController,getProjectAnalyticsController,deleteProjectController, updateProjectController,getProjectByIdAndWorkspaceIdController } from "../controllers/project.controller.js";
const ProjectRouter=express.Router()

// create project 
ProjectRouter.route("/workspace/:workspaceId/project/create").post(createProjectController)
// get all projects in workspace
ProjectRouter.route("/workspace/:workspaceId/all").get(getAllProjectsInWorkspaceController)
// get project by id and workspace id
ProjectRouter.route("/:id/workspace/:workspaceId").get(getProjectByIdAndWorkspaceIdController)
// get analytics of project
ProjectRouter.route("/:id/workspace/:workspaceId/analytics").get(getProjectAnalyticsController)
// update project controller
ProjectRouter.route("/:id/workspace/:workspaceId/update").put(updateProjectController)
ProjectRouter.route("/:id/workspace/:workspaceId/delete").delete(deleteProjectController)






export default ProjectRouter;