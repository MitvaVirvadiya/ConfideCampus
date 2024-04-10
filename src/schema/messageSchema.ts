import { z } from "zod"

export const messageSchema = z.object({
    content: z.string().min(1, "Message is required").max(200, "Message must be at most 200 characters"),
})