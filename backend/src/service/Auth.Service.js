import { Account } from "../models/account.Model.js";
import { User } from "../models/user.model.js";
import { Workspace } from "../models/workspace.model.js";
import { Role } from "../models/roles-permission.js";
import mongoose from "mongoose";
import { ROLES } from "../enums/role.enum.js";
import { BadRequestError, NotFoundError } from "../middleware/AppError.js";
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
      console.log(ownerRole);
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

export const RegisterUserService = async (data) => {
  const { name, email, password } = data;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const exists = await User.findOne({ email }).session(session);
    if (exists) {
      throw new BadRequestError("email already exists");
    }

    let user = new User({ name, email, password });
    await user.save({ session });
    // creating account
    const account = new Account({
      userId: user._id,
      provider: "EMAIL",
      providerId: email,
    });
    await account.save({ session });
    // creating workspace
    const workspace = new Workspace({
      name: "My Workspace",
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });
    // get role of owner
    const ownerRole = await Role.findOne({ name: ROLES.OWNER }).session(
      session
    );
    if (!ownerRole) throw new NotFoundError("Owner role not found");
    // creating member
    const member = new Member({
      userId: user._id,
      role: ownerRole._id,
      workspaceId: workspace._id,
      joinedAt: new Date(),
    });
    await member.save({ session });
    user.currentWorkspace = workspace._id;
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();
    return { userId: user._id, workspaceId: workspace._id };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const VerifyUserService = async ({
  email,
  password,
  provider = "EMAIL",
}) => {
  const account = await Account.findOne({ provider, providerId: email });
  // console.log(account,"account");
  if (!account) {
    // Check if a Google account exists with this email (via userId match)
    const user = await User.findOne({ email });

    if (user) {
      // Check if the user has a non-EMAIL social account
      const socialAccount = await Account.findOne({
        userId: user._id,
        provider: { $ne: "EMAIL" },
      });

      if (socialAccount) {
        throw new NotFoundError(
          `You signed up using ${socialAccount.provider}. Please login with ${socialAccount.provider} or reset your password to enable classic login.`
        );
      }
    }
    throw new NotFoundError("Inavalid email or password");
  }

  let user = await User.findById(account.userId).select("+password");

  if (!user) {
    throw new NotFoundError("user not found for this email");
  }

  // console.log(user,"user");

  const isMatch = await user.comparePassword(password);
  // console.log(isMatch,"isMatch");
  if (!isMatch) {
    throw new NotFoundError("Inavalid email or password");
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};
