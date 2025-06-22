import { UnauthorizedError } from "../middleware/AppError.js";
import { rolepermission } from "./role-permission.js"

export const roleGuard = (role, requiredPermissions = []) => {
  const permissions = rolepermission[role];
  // If the role doesn't exist or lacks required permissions, throw an exception
// console.log(permissions,
//     "at role gaurd"
// );

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );
  
  if(!hasPermission){
    throw new UnauthorizedError("You are not authorized to perform this action");
  }

};