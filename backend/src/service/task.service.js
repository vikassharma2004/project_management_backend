import { BadRequestError, NotFoundError } from "../middleware/AppError.js";
import { Member } from "../models/member.model.js";
import { Project } from "../models/projects.model.js";
import { Task } from "../models/task.model.js";


// Service to create a new task under a specific project and workspace
export const createTaskService = async (
  workspaceId,
  projectId,
  body,
  userId
) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = body;

    // Validate if project exists and belongs to the workspace
    const project = await Project.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      throw new NotFoundError(
        "Project not found or does not belong to this workspace"
      );
    }

    // If task is being assigned, ensure assigned user is a member of the workspace
    if (assignedTo) {
      const isAssignMember = await Member.exists({
        userId: assignedTo,
        workspaceId: workspaceId,
      });
      if (!isAssignMember) {
        throw new NotFoundError(
          "Assigned user is not a member of this workspace"
        );
      }
    }

    // Create and save the task
    const task = new Task({
      title,
      status,
      description,
      priority,
      dueDate,
      assignedTo,
      workspace: workspaceId,
      project: projectId,
      createdBy: userId,
    });

    await task.save();
    return { task };
  } catch (error) {
    console.log("Error while creating task", error);
    throw error;
  }
};

// update task
export const updateTaskService = async (
  workspaceId,
  taskId,
  body,

  projectId
) => {
  try {
    const project = await Project.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      throw new NotFoundException(
        "Project not found or does not belong to this workspace"
      );
    }

    const task = await Task.findById(taskId);
    if (!task || task.project.toString() !== projectId.toString()) {
      throw new NotFoundError(
        "Task not found or does not belong to this project"
      );
    }

    const updatetask = await Task.findOneAndUpdate(
      { _id: taskId },
      { ...body },
      { new: true }
    );

    if (!updatetask) {
      throw new BadRequestError("Failed to update task");
    }

    return { updatetask };
  } catch (error) {
    console.log("error while updating task", error);
    throw error;
  }
};

export const getAllTasksService = async (
  workspaceId,
  filters = {},
  pagination = {}
) => {
  try {
    const { pageSize = 10, pageNumber = 1 } = pagination;
    // Build query object
    const query = { workspace: workspaceId };

    if (filters.projectId) {
      query.project = filters.projectId;
    }

    if (filters.status && filters.status?.length > 0) {
      query.status = { $in: filters.status };
    }

    if (filters.priority && filters.priority?.length > 0) {
      query.priority = { $in: filters.priority };
    }

    if (filters.assignedTo && filters.assignedTo?.length > 0) {
      query.assignedTo = { $in: filters.assignedTo };
    }

    if (filters.keyword && filters.keyword !== undefined) {
      query.title = { $regex: filters.keyword, $options: "i" };
    }

    if (filters.dueDate) {
      query.dueDate = {
        $eq: new Date(filters.dueDate),
      };
    }
    const skip = (pageNumber - 1) * pageSize;
    //     console.log("Task skip:", skip);
    // console.log("Task count query:", query);
    // Execute both data fetch and count in parallel for efficiency
    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate("assignedTo", "_id name profilePicture -password")
        .populate("project", "_id emoji name"),
      Task.countDocuments(query),
    ]);
    // console.log("Task count query:", totalCount, tasks.length);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      tasks,
      Pagination: {
        pageSize,
        pageNumber,
        totalCount,
        totalPages,
        skip: skip || 0,
      },
    };
  } catch (error) {
    console.log("Error while fetching tasks:", error);
    throw error;
  }
};
export const getSingleTaskService = async (workspaceId, taskId, projectId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      throw new NotFoundException(
        "Project not found or does not belong to this workspace"
      );
    }
    const task = await Task.findById(taskId).populate(
      "assignedTo",
      "_id name profilePicture -password"
    );

    if (!task) {
      throw new NotFoundError("Task not found");
    }
    return { task };
  } catch (error) {
    console.log("Error while fetching task:", error);
    throw error;
  }
};
export const deleteTaskService = async (workspaceId, taskId) => {
  try {
    const Task = await Task.findByIdAndDelete({
      _id: taskId,
      workspace: workspaceId,
    });
    if (!Task) {
      throw new NotFoundError(
        "Task not found or does not belong to this workspace"
      );
    }
    return deletedTask;
  } catch (error) {
    console.log("error in deleting task", error);
    throw error;
  }
};
