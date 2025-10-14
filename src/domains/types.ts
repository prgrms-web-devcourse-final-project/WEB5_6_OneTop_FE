import { signUpSchema } from "./auth/schemas/signUpSchema";
import { z } from "zod";

export type SignUpRequest = z.infer<typeof signUpSchema>;

// Re-export error types for easier access
export * from "@/share/errors/serverErrorMessages";