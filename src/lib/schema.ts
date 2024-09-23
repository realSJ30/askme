import { z } from "zod"
export const MessageSchema = z.object({
    message: z
        .string()
        .min(1, {
            message: "Message must be at least 1 character.",
        })
        .max(500, {
            message: "Message must not be longer than 500 characters.",
        }),
})