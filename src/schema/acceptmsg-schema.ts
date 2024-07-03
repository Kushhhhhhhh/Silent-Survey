import { z } from "zod";

export const acceptmsgSchema = z.object({
    acceptMessages: z.boolean(),
})