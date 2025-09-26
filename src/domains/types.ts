import { signUpSchema } from "./auth/lib/signUpSchema";
import { z } from "zod";

export type SignUpRequest = z.infer<typeof signUpSchema>;
