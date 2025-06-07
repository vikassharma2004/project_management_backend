import mongoose from "mongoose";

const accountSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    provider:{
        type:String,
        enum:["GOOGLE","GMAIL","GITHUB","FACEBOOK"],
        required:true
    },
    providerId:{
        type:String,
        required:true,
        unique:true
    },
    refreshToken:{
        type:String,
        default:null
    },
    tokenExpiery:{
        type:Date,
        default:null
    }
},{timestamps:true,toJson:{
    transform(doc,ret){
        
        delete ret.refreshToken
    }
}})

export const Account=mongoose.model("Account",accountSchema)