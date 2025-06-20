import {z} from "zod";


export const workspaceSchema=z.object({
    name:z.string().min(3).max(20),
    description:z.string().trim().optional(),
})