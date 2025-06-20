import { HTTPSTATUS } from "../config/http.config.js";
import { ROLES } from "../enums/role.enum.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../middleware/AppError.js";
import { Member } from "../models/member.model.js";
import { Role } from "../models/roles-permission.js";
import { Workspace } from "../models/workspace.model.js";

export const getMemberRoleInWorkspace = async (userId, workspaceId) => {
  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundError("Workspace not found");

    const member = await Member.findOne({ userId, workspaceId }).populate(
      "role"
    );
    if (!member)
      throw new UnauthorizedError(
        "you are not member of this workspace",
        (errorCode = HTTPSTATUS.UNAUTHORIZED)
      );

    const roleName = member.role?.name;

    return { role: roleName };
  } catch (error) {}
};

export const joinworkspaceService = async (inviteCode, userId) => {

    // find workspace by intive code
  const workspace = await Workspace.findOne({ inviteCode });
  console.log("workspace", workspace);
  if (!workspace)
    throw new NotFoundError("Invalid invite code . workspace not found");
// check if user already exits
  const existingmember = await  Member.findOne({ userId, workspaceId: workspace._id });
  console.log("existingmember", existingmember);
  if (existingmember) {
    throw new BadRequestError("You are already a member of this workspace");
  }
  // finds roles
  const role = await Role.findOne({ name: ROLES.MEMBER });
  if (!role) throw new NotFoundError("Role not found");
  // create a member record
  const member = await Member.create({
    userId,
    workspaceId: workspace._id,
    role: role._id,

  });
  await member.save();
  return { workspaceId: workspace._id, role: role.name };
};
