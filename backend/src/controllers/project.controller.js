import { HTTPSTATUS } from "../config/http.config.js";
import { permissions } from "../enums/role.enum.js";
import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import { CreateProjectService, getProjectsInWorkspaceService, UpdateProjectService } from "../service/project.service.js";
import { roleGuard } from "../utils/roleGaurd.js";
import { createProjectSchema, updateProjectSchema } from "../validation/project.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";

export const createProjectController=catchAsyncError(async(req,res)=>{
    const {emoji,name,description}=createProjectSchema.parse(req.body)
    const workspaceId=workspaceIdSchema.parse(req.params.workspaceId)
    const userId=req.user?._id
    // get role of user in workspace
   const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
   // check for permisions
     roleGuard(role, [permissions.CREATE_PROJECT]);

     const {project}=await CreateProjectService(workspaceId,userId,emoji,name,description)
      return res.status(HTTPSTATUS.CREATED).json({
      message: "Project created successfully",
      project,
    });
});
export const getAllProjectsInWorkspaceController=catchAsyncError(async(req,res)=>{
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
  
})

export const  updateProjectController=catchAsyncError(async(req,res)=>{
    const projectId=req.params.id;
    const workspaceId=workspaceIdSchema.parse(req.params.workspaceId)
    const userId=req.user?._id
     const body = updateProjectSchema.parse(req.body);

  
    // get role of user in workspace
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    // check if user has permission
    roleGuard(role, [permissions.EDIT_PROJECT]);

    const {project}=await UpdateProjectService(projectId,workspaceId,body) 
      return res.status(HTTPSTATUS.OK).json({
      message: "Project updated successfully",
      project,
    });
})