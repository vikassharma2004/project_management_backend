import { NotFoundError } from "../middleware/AppError.js";
import { Project } from "../models/projects.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.Model.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";

//create project
export const CreateProjectService = async (
  workspaceId,
  userId,
  emoji,
  name,
  description
) => {
  try {
    const project = await Project.create({
      emoji: emoji || "🚀",
      name,
      description,
      workspace: workspaceId,
      createdBy: userId,
    });
    return { project };
  } catch (error) {
    console.log("some error occured while creating project");
    throw error;
  }
};
// get project service
export const getProjectsInWorkspaceService = async (
  workspaceId,
  pageSize,
  pageNumber
) => {
  try {
    const projects = await Project.find({ workspace: workspaceId })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("createdBy", "name email profilePicture");
    const totalCount = await Project.countDocuments({ workspace: workspaceId });
    const totalPages = Math.ceil(totalCount / pageSize);
    const skip = (pageNumber - 1) * pageSize;
    return { projects, totalCount, totalPages, skip };
  } catch (error) {
    console.log("some error occured while fetching projects");
    throw error;
  }
};

// update project issue
export const UpdateProjectService = async (workspaceId, projectId, body) => {
  try {
    // Log and validate
    const { name, emoji, description } = body;
    console.log(
      "UpdateProjectService called with:",
      workspaceId,
      projectId,
      body
    );

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

    await project.save();

    return { project };
  } catch (error) {
    console.log("error while editing project", error);
    throw error;
  }
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId,
  projectId
) => {
  try {
    const project = await Project.findOne({
      _id: projectId,
      workspace: workspaceId,
    }).select("emoji name description _id");
    if (!project) {
      throw new NotFoundError(
        "Project not found or does not belong to the specified workspace"
      );
    }
    return { project };
  } catch (error) {
    console.log("error while fetching project by id", error);
    throw error;
  }
};

// Service to get analytics for a specific project within a workspace
export const getProjectAnalyticsService = async (workspaceId, projectId) => {
  try {
    // Step 1: Find the project by its ID
    const project = await Project.findById(projectId);

    // Step 2: If the project does not exist or doesn't belong to the workspace, throw an error
    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      throw new NotFoundError(
        "Project not found or does not belong to this workspace"
      );
    }

    const currentdate = new Date(); // Get current date for overdue comparison

    // Step 3: Aggregate analytics on tasks related to the project
    const taskAnalytics = await Task.aggregate([
      {
        // Filter tasks that belong to the given project
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        // Use $facet to compute multiple aggregates in a single query
        $facet: {
          // Count all tasks
          totalTasks: [{ $count: "count" }],

          // Count tasks that are overdue (dueDate < current date and status is not DONE)
          overdueTasks: [
            {
              $match: {
                dueDate: { $lt: currentdate },
                status: { $ne: "DONE" },
              },
            },
            { $count: "count" },
          ],

          // Count tasks that are completed (status === DONE)
          completedTasks: [
            {
              $match: {
                status: "DONE",
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const _analytics = taskAnalytics[0]; // Access the first (and only) result from aggregation

    // Step 4: Format the result and handle cases where the counts might be missing
    const analytics = {
      totalTasks: _analytics.totalTasks[0]?.count || 0,
      overdueTasks: _analytics.overdueTasks[0]?.count || 0,
      completedTasks: _analytics.completedTasks[0]?.count || 0,
    };

    // Step 5: Return the analytics object
    return {
      analytics,
    };
  } catch (error) {
    // Log and rethrow any error that occurs
    console.log("Error while fetching project analytics", error);
    throw error;
  }
};
export const deleteProjectService=async(workspaceId,projectId)=>{
  try {
      const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new NotFoundError(
      "Project not found or does not belong to the specified workspace"
    );
  }

  await project.deleteOne();

  await Task.deleteMany({
    project: project._id,
  });

  return project;
  } catch (error) {
    console.log("error occured at delted project",error)
    throw error;
  }
}