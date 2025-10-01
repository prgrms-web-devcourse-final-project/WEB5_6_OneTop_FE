import { signUpSchema } from "./auth/schemas/signUpSchema";
import { z } from "zod";

export type SignUpRequest = z.infer<typeof signUpSchema>;
