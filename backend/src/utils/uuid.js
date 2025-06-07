import {v4 as uuidv4} from "uuid";

export const generateInviteCode=()=>{
return uuidv4().replace(/-/g, "").substring(0, 8);
}

export const generateTaskCode=()=>{
return `task-${uuidv4().replace(/-/g, "").substring(0, 3)}`;
}