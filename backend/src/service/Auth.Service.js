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

  const session = await mongoose.startSession();
  console.log("Session started");

  try {
    await session.startTransaction();
    console.log("Transaction started");

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: displayName,
        email,
        profilePicture: { url: picture },
      });
      await user.save({ session });
      console.log("User created");

      const account = new Account({
        userId: user._id,
        provider,
        providerId,
        displayName,
        email,
        picture,
      });
      await account.save({ session });
      console.log("Account created");

      const workspace = new Workspace({
        name: "My Workspace",
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });
      console.log("Workspace created");

      const ownerRole = await Role.findOne({ name: ROLES.OWNER }).session(
        session
      );
      console.log(ownerRole)
      if (!ownerRole) throw new NotFoundError("Owner role not found");

      const member = new Member({
        userId: user._id,
        role: ownerRole._id,
        workspaceId: workspace._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id;
      await user.save({ session });
    }
    console.log("Member created");
    console.log("Committing transaction");

    await session.commitTransaction();
    console.log("Transaction committed");
    return user;
  } catch (error) {
    console.error("Error during login/create:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
    console.log("Session ended");
  }
};
