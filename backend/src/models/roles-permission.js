import mongoose from "mongoose";
import { permissions, ROLES } from "../enums/role.enum.js";
import { rolepermission } from "../utils/role-permission.js";

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      trim: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(permissions),
      required: true,
      default: [], // placeholder
    },
  },
  { timestamps: true }
);

// 🚀 Middleware to set default permissions based on role name
RoleSchema.pre("validate", function (next) {
  if (!this.permissions || this.permissions.length === 0) {
    this.permissions = rolepermission[this.name] || [];
  }
  next();
});

export const Role = mongoose.model("Role", RoleSchema);
