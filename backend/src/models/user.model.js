import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true
    },
    password: {
        type: String,
     
       select: false, // exclude by default
    },
    profilePicture:{
        url:String,
        public_id:String
    },
    currentWorkspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    lastLogin:{
        type:Date,
        default:null
    }
},{timestamps:true});






userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});
// Instance method to omit password

userSchema.methods.OmitPassword = async function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};
// Instance method to compare plain text password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("Password not set on user document");
  }
  return bcrypt.compare(candidatePassword, this.password);
};



export const User =  mongoose.models.User || mongoose.model("User", userSchema);