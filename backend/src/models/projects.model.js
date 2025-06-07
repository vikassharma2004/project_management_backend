import mongoose from "mongoose";


const projectSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    emoji:{
        type:String,
        required:true,
        default:"🚀"
    },
    description:{
        type:String,
        required:false
    },
    workspace:{
        tpe:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    createdBy:{
        tpe:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Project=mongoose.model("Project",projectSchema)