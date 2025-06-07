import { Account } from "../models/account.Model.js";
import { User } from "../models/user.Model.js";
import { Workspace } from "../models/workspace.model.js";
import { Role } from "../models/roles-permission.js";
import mongoose from "mongoose";
import { ROLES } from "../enums/role.enum.js";
import { NotFoundError } from "../middleware/AppError.js";
import { Member } from "../models/member.model.js";
export const loginOrCreateAccountService = async (data) => {
  const { provider, providerId, displayName, email, picture } = data;
  try {
    const session = await mongoose.startSession();
    console.log("session started");

    let user = await User.findOne({ email });
    if (!user) {
      // create new user if user dosent exit
      user = new User({
        name: displayName,
        email,

        profilePicture: { url: picture },
      });
      await user.save({ session });
      console.log("user created");
      // create account for user
      const account = new Account({
        userId: user._id,
        provider,
        providerId,
        displayName,
        email,
        picture,
      });
      await account.save({ session });
      console.log("account created");
      // create worksapce for user
      const workspace = new Workspace({
        name: "My Workspace",
        description: `Workspace  created for for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });
      console.log("workspace created");

      // get roles
      const ownerrole = await Role.findOne({ name: ROLES.OWNER }).session(
        session
      );
      if (!ownerrole) {
        throw new NotFoundError("Owner role not found");
      }

      // add member
      const member = new Member({
        userId: user._id,
        role: ownerrole._id,
        workspaceId: workspace._id,
        joinedAt: new Date(),
      });
      await member.save({ session });
      console.log("member created");

      user.currentWorkspace = workspace._id;

      await user.save({ session });
      console.log("user saved");
    }
    await session.commitTransaction();
    session.endSession();
    console.log("session ended");

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};
