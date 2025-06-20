import express from "express"
import { createProjectController,getAllProjectsInWorkspaceController, updateProjectController } from "../controllers/project.controller.js";
const ProjectRouter=express.Router()


ProjectRouter.route("/workspace/:workspaceId/project/create").post(createProjectController)
ProjectRouter.route("/workspace/:workspaceId/all").get(getAllProjectsInWorkspaceController)
ProjectRouter.route("/:id/workspace/:workspaceId/update").put(updateProjectController)






export default ProjectRouter;