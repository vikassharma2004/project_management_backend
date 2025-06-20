import { HTTPSTATUS } from "../config/http.config.js";
import { permissions } from "../enums/role.enum.js";
import { NotFoundError } from "../middleware/AppError.js";
import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import {
  ChangeMemberRoleService,
  CreateWorkspace,
  getAllWorkSpace,
  getWorksapceAnalyticsService,
  WorksapceMembers,
  WorkSpaceById,
} from "../service/Workspace.service.js";
import { roleGuard } from "../utils/roleGaurd.js";
import { workspaceSchema } from "../validation/workspace.validation.js";

export const CreateWorkspaceController = catchAsyncError(async (req, res) => {
  const body = workspaceSchema.parse(req.body);
  const userId = req.user?._id;
  let { workspace } = await CreateWorkspace(body, userId);
  console.log(workspace);
  res.json({ message: "workspace created successfully", workspace });
});

export const getUserAllWorkspace = catchAsyncError(async (req, res) => {
  const userId = req.user?._id;

  const { workspaces } = await getAllWorkSpace(userId);
  res.json({ message: "workspace fetched successfully", workspaces });
});

export const getWorkspaceById = catchAsyncError(async (req, res) => {
  const workspaceId = req.params.id;
  if (!workspaceId) throw new NotFoundError("workspaceId is required");
  const userId = req.user?._id;
  // member service
  await getMemberRoleInWorkspace(userId, workspaceId);
  // workspace servie to get workspace by id
  const { workspace } = await WorkSpaceById(workspaceId);
  res
    .status(HTTPSTATUS.OK)
    .json({ message: "workspace fetched successfully", workspace });
});

export const getWorkspaceMembers = catchAsyncError(async (req, res) => {
  const userId = req.user?._id;
  const workspaceId = req.params.id;
  if (!workspaceId) throw new NotFoundError("workspaceId is required");
  // member service
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
 
  roleGuard(role, [permissions.VIEW_ONLY]);
  // workspace servie to get workspace by id
  const { members,roles } = await WorksapceMembers(workspaceId);
  res
    .status(HTTPSTATUS.OK)
    .json({ message: "workspace members retrieved successfully", members,roles });
});
export const getWorkspaceAnalytics = catchAsyncError(async (req, res) => {
  const userId = req.user?._id;
  const workspaceId = req.params.id;
  if (!workspaceId) throw new NotFoundError("workspaceId is required");
  // member service
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  
  roleGuard(role, [permissions.VIEW_ONLY]);
  // workspace servie to get workspace by id
  const { analytics } = await getWorksapceAnalyticsService(workspaceId);
  res
    .status(HTTPSTATUS.OK)
    .json({ message: "workspace analytics retrieved successfully", analytics });
});

export const ChangememberRole=catchAsyncError(async(req,res)=>{
    const userId = req.user?._id;
    const workspaceId = req.params.id;
    const {memberId,roleId}=req.body
    if(!memberId || !roleId) throw new NotFoundError("memberId and roleId is required");
    if (!workspaceId) throw new NotFoundError("workspaceId is required");
    // member service
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    
    // check for permisions
    roleGuard(role, [permissions.CHANGE_MEMBER_ROLE]);
    // workspace servie to get workspace by id
    const { member } = await ChangeMemberRoleService(workspaceId,memberId,roleId);
    res
      .status(HTTPSTATUS.OK)
      .json({ message: "member role changed successfully", member });
})