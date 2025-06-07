import mongoose from "mongoose";
import { generateTaskCode } from "../utils/uuid.js";

const taskSchema=mongoose.Schema({
    taskCode:{
        type:String,
        required:true,
        unique:true,
        default:generateTaskCode
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true,
        required:false,
        default:null
    },
    project:{
        tpe:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    workspace:{
        tpe:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    status:{
        type:String,
        enum:["TODO","IN_PROGRESS","COMPLETED"],
        required:true,
        default:"TODO"
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdBy:{
        tpe:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
  dueDate:{
    type:Date,
    default:null
  },
    priority:{
        type:String,
        enum:["LOW","MEDIUM","HIGH"],
        required:true,
        default:"MEDIUM"
    }
},{timestamps:true})


taskSchema.methods.generateTaskCode=async function(){
    this.taskCode=generateTaskCode()
    return this.save()
}
export const Task=mongoose.model("Task",taskSchema)