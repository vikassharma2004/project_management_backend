import { HTTPSTATUS } from "../config/http.config.js";
import { catchAsyncError } from "../middleware/asyncErrorHandler.js";
import { joinworkspaceService } from "../service/member.service.js";

export const joinWorkspaceController=catchAsyncError(async(req,res)=>{
    const InviteCode=req.params.inviteCode
    const userId=req.user?._id

    const {workspaceId,role}=await joinworkspaceService(InviteCode,userId)
    res.status(HTTPSTATUS.OK).json({message:"workspace joined successfully",workspaceId,role})
})