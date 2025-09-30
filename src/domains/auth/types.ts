import { loginResponseSchema } from "./schemas/loginResponseSchema";
import z from "zod";


export type AuthUser = z.infer<typeof loginResponseSchema>;

