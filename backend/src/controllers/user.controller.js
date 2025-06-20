import { HTTPSTATUS } from "../config/http.config.js";
import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { getCuurentUserService } from "../service/user.service.js";

export const getCurrentUser = catchAsyncError(async (req, res, next) => {
    const userid=req.user?._id
    const {user}=await getCuurentUserService(userid)
    res.status(HTTPSTATUS.OK).json({message:"user fetch successfully",user})

})