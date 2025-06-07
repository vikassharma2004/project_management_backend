import { ROLES, permissions } from "../enums/role.enum.js";


export const rolepermission = {
  OWNER: [
    // Workspace permissions
    permissions.CREATE_WORKSPACE,
    permissions.EDIT_WORKSPACE,
    permissions.DELETE_WORKSPACE,
    permissions.MANAGE_WORKSPACE_SETTINGS,
    permissions.TRANSFER_OWNERSHIP,
    permissions.ARCHIVE_WORKSPACE,
    permissions.VIEW_WORKSPACE_ANALYTICS,

    // Member permissions
    permissions.ADD_MEMBER,
    permissions.REMOVE_MEMBER,
    permissions.CHANGE_MEMBER_ROLE,
    permissions.INVITE_GUEST,
    permissions.VIEW_MEMBER_LIST,
    permissions.ASSIGN_MEMBER_TO_PROJECT,

    // Project permissions
    permissions.CREATE_PROJECT,
    permissions.EDIT_PROJECT,
    permissions.DELETE_PROJECT,
    permissions.ASSIGN_PROJECT_LEAD,
    permissions.ARCHIVE_PROJECT,
    permissions.VIEW_PROJECT_ACTIVITY,

    // Task permissions
    permissions.CREATE_TASK,
    permissions.EDIT_TASK,
    permissions.DELETE_TASK,
    permissions.ASSIGN_TASK,
    permissions.MARK_TASK_COMPLETE,
    permissions.COMMENT_ON_TASK,
    permissions.VIEW_TASK_HISTORY,

    // System / Extra
    permissions.EXPORT_DATA,
    permissions.GENERATE_REPORT,
    permissions.INTEGRATE_THIRD_PARTY_APPS,

    // Read-only fallback
    permissions.VIEW_ONLY
  ],

  ADMIN: [
    // Workspace permissions
    permissions.MANAGE_WORKSPACE_SETTINGS,
    permissions.ARCHIVE_WORKSPACE,
    permissions.VIEW_WORKSPACE_ANALYTICS,

    // Member permissions
    permissions.ADD_MEMBER,
    permissions.REMOVE_MEMBER,
    permissions.INVITE_GUEST,
    permissions.VIEW_MEMBER_LIST,
    permissions.ASSIGN_MEMBER_TO_PROJECT,

    // Project permissions
    permissions.CREATE_PROJECT,
    permissions.EDIT_PROJECT,
    permissions.DELETE_PROJECT,
    permissions.ASSIGN_PROJECT_LEAD,
    permissions.ARCHIVE_PROJECT,
    permissions.VIEW_PROJECT_ACTIVITY,

    // Task permissions
    permissions.CREATE_TASK,
    permissions.EDIT_TASK,
    permissions.DELETE_TASK,
    permissions.ASSIGN_TASK,
    permissions.MARK_TASK_COMPLETE,
    permissions.COMMENT_ON_TASK,
    permissions.VIEW_TASK_HISTORY,

    // System / Extra
    permissions.EXPORT_DATA,
    permissions.GENERATE_REPORT,

    // Read-only fallback
    permissions.VIEW_ONLY
  ],

  MEMBER: [
    // Task permissions only
    permissions.CREATE_TASK,
    permissions.EDIT_TASK,
    permissions.DELETE_TASK,
    permissions.MARK_TASK_COMPLETE,
    permissions.COMMENT_ON_TASK,
    permissions.VIEW_TASK_HISTORY,

    // Member permissions (view only)
    permissions.VIEW_MEMBER_LIST,

    // Read-only fallback
    permissions.VIEW_ONLY
  ]
};
