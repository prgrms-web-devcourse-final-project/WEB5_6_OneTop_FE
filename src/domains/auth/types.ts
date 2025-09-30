import { userResponseSchema } from "./schemas/loginResponseSchema";
import z from "zod";


export type AuthUser = z.infer<typeof userResponseSchema>;

