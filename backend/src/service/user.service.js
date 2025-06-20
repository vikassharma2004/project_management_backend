import { BadRequestError } from "../middleware/AppError.js";
import { User } from "../models/user.Model.js";

export const getCuurentUserService = async (id) => {
    const user = await User.findById(id).populate("currentWorkspace").select("-password");
    if(!user){
        throw new BadRequestError("User not found");
    }
    return { user };
};