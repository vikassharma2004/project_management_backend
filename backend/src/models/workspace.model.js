import mongoose from "mongoose";
import { generateInviteCode } from "../utils/uuid.js";


const workspaceSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        
    },
    owner:{
        tpe:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
inviteCode:{
    type:String,
    unique:true,
    required:true,
    default:generateInviteCode
}
},{timestamps:true})

workspaceSchema.methods.generateInviteCode=async function(){
    this.inviteCode=generateInviteCode()
    return this.save()
}

export const Workspace=mongoose.model("Workspace",workspaceSchema)