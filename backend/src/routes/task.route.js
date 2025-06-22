import express from "express";
import {
  createTaskController,
  getAllTasksController,
  UpdateTaskController,
  getSingleTask,
  DeleteTaskController,
} from "../controllers/task.controller.js";
const TaskRouter = express.Router();

//create task
TaskRouter.route("/project/:projectId/workspace/:workspaceId/create").post(
  createTaskController
);
// get all task
TaskRouter.route("/workspace/:workspaceId/all").get(getAllTasksController);
// update task
TaskRouter.route("/:id/project/:projectId/workspace/:workspaceId/update").put(
  UpdateTaskController
);
// get seingle task
TaskRouter.route("/:id/project/:projectId/workspace/:workspaceId").get(
  getSingleTask
);
//delete task
TaskRouter.route("/:id/workspace/:workspaceId/delete").delete(
  DeleteTaskController
);

export default TaskRouter;
