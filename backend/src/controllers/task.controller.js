import { HTTPSTATUS } from "../config/http.config.js";
import { permissions } from "../enums/role.enum.js";
import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { getMemberRoleInWorkspace } from "../service/member.service.js";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getSingleTaskService,
  updateTaskService,
} from "../service/task.service.js";
import { roleGuard } from "../utils/roleGaurd.js";
import { projectIdSchema } from "../validation/project.validation.js";
import {
  createTaskSchema,
  taskIdSchema,
} from "../validation/task.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";

export const createTaskController = catchAsyncError(async (req, res) => {
  const ProjectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const body = createTaskSchema.parse(req.body);
  const userId = req.user?._id;

  // get role of user in workspace
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  // check if user has permission
  roleGuard(role, [permissions.CREATE_TASK]);

  const { task } = await createTaskService(
    workspaceId,
    ProjectId,
    body,
    userId
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "Task created successfully",
    task,
  });
});

export const UpdateTaskController = catchAsyncError(async (req, res) => {
  const taskId = taskIdSchema.parse(req.params.id);
  const body = createTaskSchema.parse(req.body);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const userId = req.user?._id;
  // get role of user in workspace
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  // check if user has permission
  roleGuard(role, [permissions.EDIT_TASK]);
  const { updatetask } = await updateTaskService(
    workspaceId,
    taskId,
    body,
    userId,
    projectId
  );
  return res.status(HTTPSTATUS.OK).json({
    message: "Task updated successfully",
    updatetask,
  });
});
export const getAllTasksController = catchAsyncError(async (req, res) => {
  const userId = req.user?._id;
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const filters = {
    projectId: req.query.projectId,
    status: req.query.status,
    priority: req.query.priority,
    assignedTo: req.query.assignedTo,
    keyword: req.query.keyword,
    dueDate: req.query.dueDate,
  };
  const pagination = {
    pageSize: parseInt(req.query.pageSize) || 10,
    pageNumber: parseInt(req.query.pageNumber) || 1,
  };

  // get role of user in workspace
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  // check if user has permission
  roleGuard(role, [permissions.VIEW_ONLY]);
  // service to get all tasks
  const result = await getAllTasksService(workspaceId, filters, pagination);
  return res.status(HTTPSTATUS.OK).json({
    message: "Tasks fetched successfully",
    ...result,
  });
});
export const getSingleTask = catchAsyncError(async (req, res) => {
  const taskId = taskIdSchema.parse(req.params.id);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;
  // get role of user in workspace
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  // check if user has permission
  roleGuard(role, [permissions.VIEW_ONLY]);
  const { task } = await getSingleTaskService(workspaceId, taskId, projectId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Task fetched successfully",
    task,
  });
});

export const DeleteTaskController=catchAsyncError(async(req,res)=>{
  const taskId = taskIdSchema.parse(req.params.id);
 
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;
  // get role of user in workspace
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  // check if user has permission
  roleGuard(role, [permissions.DELETE_TASK]);
  await deleteTaskService(workspaceId,taskId)
  return res.status(HTTPSTATUS.OK).json({
    message: "Task deleted successfully",
  });
})