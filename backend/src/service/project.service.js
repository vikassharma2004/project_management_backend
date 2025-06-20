import { NotFoundError } from "../middleware/AppError.js";
import { Project } from "../models/projects.model.js";
import { User } from "../models/user.Model.js";
import { Workspace } from "../models/workspace.model.js";

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
export const UpdateProjectService = async (workspaceId, projectId, body) => {
  try {
    const { name, emoji, description } = body;
    console.log("body", body);
    console.log(workspaceId, projectId);
    const project = await Project.find({ _id: projectId });
    console.log("proejcr", project);
    if (!project) {
      throw new NotFoundError(
        "Project not found or does not belong to the specified workspace"
      );
    }
    if (emoji) project.emoji = emoji;
    if (name) project.name = name;
    if (description) project.description = description;
    await project.save();

    return { project };
  } catch (error) {
    console.log(" error while editing project", error);
    throw error;
  }
};
