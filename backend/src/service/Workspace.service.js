import { ROLES } from "../enums/role.enum.js";
import { NotFoundError, UnauthorizedError } from "../middleware/AppError.js";
import { Member } from "../models/member.model.js";
import { Project } from "../models/projects.model.js";
import { Role } from "../models/roles-permission.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.Model.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";

export const CreateWorkspace = async (data, userId) => {
  try {
    const { name, description } = data;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const ownerRole = await Role.findOne({ name: ROLES.OWNER });
    if (!ownerRole) throw new NotFoundError("Owner role not found");

    const workspace = new Workspace({
      name,
      description,
      owner: userId,
    });
    await workspace.save();

    const member = new Member({
      userId: user._id,
      role: ownerRole._id,
      workspaceId: workspace._id,
    });
    await member.save();

    // Optional: update user's currentWorkspace field if you have one
    user.currentWorkspace = workspace._id;
    await user.save();

    return { workspace };
  } catch (err) {
    console.error("Error creating workspace:", err);
    throw err;
  }
};

// get worksapce user is member
export const getAllWorkSpace = async (userId) => {
  try {
    const memberships = await Member.find({ userId })
      .populate("workspaceId")
      .select("-password");
    // console.log(memberships);
    // extract workspace details from memberships
    const workspaces = memberships.map((membership) => membership.workspaceId);
    return { workspaces };
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    throw err;
  }
};
//workspace by id
export const WorkSpaceById = async (workspaceId) => {
  try {
    const workspace = await Workspace.findById(workspaceId).populate("owner");
    // console.log("workspace at workspace servie", workspace);
    if (!workspace) throw new NotFoundError("Workspace not found");
    const members = await Member.find({ workspaceId }).populate("role");
    // console.log("members at workspace servie", members);

    const WorkspaceWithMembers = { ...workspace.toObject(), members };
    return { workspace: WorkspaceWithMembers };
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    throw err;
  }
};
// member in workspace
export const WorksapceMembers = async (workspaceId) => {
  try {
    const members = await Member.find({ workspaceId })
      .populate("userId", "name email profilePicture ")
      .populate("role", "role");
    // console.log("members at workspace servie for members", members);
    const roles = await Role.find({}, { name: 1, _id: 1 })
      .select("-permissions")
      .lean();
    // console.log("roles at workspace servie for roles", roles);
    return { members, roles };
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    throw err;
  }
};
// workspace analytics
export const getWorksapceAnalyticsService = async (workspaceId) => {
  try {
    const currentdate = new Date();
    const totaltask = await Task.countDocuments({ workspaceId });
    const overduetask = await Task.countDocuments({
      workspaceId,
      dueDate: { $lt: currentdate },
      status: { $ne: "COMPLETED" },
    });
    const completedtask = await Task.countDocuments({
      workspaceId,
      status: "COMPLETED",
    });
    const analytics = {
      totaltask,
      overduetask,
      completedtask,
    };

    return { analytics };
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    throw err;
  }
};

export const ChangeMemberRoleService = async (
  workspaceId,
  memberId,
  roleId
) => {
  try {
    // finds the workspace
    const workspace = await Workspace.findById(workspaceId);
    // console.log(workspace,"at change member role")
    if (!workspace) throw new NotFoundError("workspace not found");
    // finds the role
    const role = await Role.findById(roleId);
    // console.log(role,"role at change role")
    if (!role) throw new NotFoundError("role not found");
    console.log("role", role);
    // finds the member
    const member = await Member.findOne({ workspaceId, userId: memberId });
    if (!member) throw new NotFoundError("member not found in workspace");

    member.role = role;
    await member.save();
    return { member };
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
};
export const updateWorkspaceByIdService = async (
  workspaceId,
  name,
  description
) => {
  try {
    const workspace = await Workspace.findById(workspaceId);
    // console.log(workspace,"at update workspace")
    if (!workspace) throw new NotFoundError("workspace not found");
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();
    return { workspace };
  } catch (error) {
    console.error("Error updating workspace:", error);
    throw error;
  }
};
export const deleteWorkspaceByIdService = async (workspaceId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // find if the workspace exists
    const workspace = await Workspace.findById(workspaceId).session(session);
    // console.log("workspace", workspace);
    if (!workspace) throw new NotFoundError("workspace not found");
    if (workspace.owner.toString() !== userId.toString())
      throw new UnauthorizedError(
        "You are not authorized to delete this workspace"
      );
    // find the user
    const user = await User.findById(userId).session(session);
    // console.log(user)
    if (!user) throw new NotFoundError("user not found");
    // delete all the project of workspace

    await Project.deleteMany({ workspace: workspace._id }).session(session);
    // delete all the task of workspace
    await Task.deleteMany({ workspace: workspace._id }).session(session);
    // delete all the member of workspace
    await Member.deleteMany({ workspaceId }).session(session);
    // update user current org
    if (user?.currentWorkspace.equals(workspaceId)) {
      const memberworkspace = await Member.findOne({ userId }).session(session);
      // update user current org
      user.currentWorkspace = memberworkspace
        ? memberworkspace.workspaceId
        : null;
      await user.save({ session });
    }
    // delete org
    await Workspace.deleteOne({ _id: workspaceId }).session(session);
    await session.commitTransaction();
    session.endSession();
    return { currentWorkspace: user.currentWorkspace };
  } catch (error) {
    console.error("Error deleting workspace:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
