import * as z from "zod";

export const tokenSchema = z
  .object({
    name: z
      .string({ required_error: "Title is a required filed" })
      .min(5, { message: "Title must be atleast 5 characters long" }),
    expiresIn: z.union([
      z.enum(["1d", "7d", "30d", "90d", "365d"]),
      z.undefined(),
    ]),
  })
  .strict();
