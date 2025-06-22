import mongoose from "mongoose";
import { HTTPSTATUS } from "../config/http.config.js";
import { permissions } from "../enums/role.enum.js";
import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import {
  CreateProjectService,
  deleteProjectService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  getProjectsInWorkspaceService,
  UpdateProjectService,
} from "../service/project.service.js";
import { roleGuard } from "../utils/roleGaurd.js";
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "../validation/project.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";
import { Project } from "../models/projects.model.js";
//create project

export const createProjectController = catchAsyncError(async (req, res) => {
  const { emoji, name, description } = createProjectSchema.parse(req.body);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;
  // get role of user in workspace
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  // check for permisions
  roleGuard(role, [permissions.CREATE_PROJECT]);

  const { project } = await CreateProjectService(
    workspaceId,
    userId,
    emoji,
    name,
    description
  );
  return res.status(HTTPSTATUS.CREATED).json({
    message: "Project created successfully",
    project,
  });
});
// get all project
export const getAllProjectsInWorkspaceController = catchAsyncError(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;
    // get role of user in workspace
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    // check if user has permission
    roleGuard(role, [permissions.VIEW_ONLY]);

    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const { projects, totalCount, totalPages, skip } =
      await getProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

    return res.status(HTTPSTATUS.OK).json({
      message: "Project fetched successfully",
      projects,
      pagination: {
        totalCount,
        pageSize,
        pageNumber,
        totalPages,
        skip,
        limit: pageSize,
      },
    });
  }
);

export const updateProjectController = catchAsyncError(async (req, res) => {
  const projectId = projectIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;

  const body = updateProjectSchema.parse(req.body);
  const { name, emoji, description } = body;

  // get role of user in workspace
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  // check if user has permission
  roleGuard(role, [permissions.EDIT_PROJECT]);
  // this was not working so had to do here
  // const { project } = await UpdateProjectService(projectId, workspaceId, body);
  const project = await Project.findById(projectId);
  // Step 2: If the project does not exist or doesn't belong to the workspace, throw an error
  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundError(
      "Project not found or does not belong to this workspace"
    );
  }
  if (emoji) project.emoji = emoji;
  if (name) project.name = name;
  if (description) project.description = description;

  await project.save();
  return res.status(HTTPSTATUS.OK).json({
    message: "Project updated successfully",
    project,
  });
});
//get project by id controller
export const getProjectByIdAndWorkspaceIdController = catchAsyncError(
  async (req, res) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;
    // get role of user in workspace
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    // check if user has permission
    roleGuard(role, [permissions.VIEW_ONLY]);
    const { project } = await getProjectByIdAndWorkspaceIdService(
      workspaceId,
      projectId
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Project fetched successfully",
      project,
    });
  }
);
// get analytics of proejct
export const getProjectAnalyticsController = catchAsyncError(
  async (req, res) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;
    // get role of user in workspace
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    // check if user has permission
    roleGuard(role, [permissions.VIEW_ONLY]);
    const { analytics } = await getProjectAnalyticsService(
      workspaceId,
      projectId
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Project analytics fetched successfully",
      analytics,
    });
  }
);
export const deleteProjectController=catchAsyncError(async(req,res)=>{
  const projectId = projectIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;
   // get role of user in workspace
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    // check if user has permission
    roleGuard(role, [permissions.VIEW_ONLY]);

    await deleteProjectService(workspaceId,projectId)
     return res.status(HTTPSTATUS.OK).json({
      message: "Project deleted successfully",
    });
  
})