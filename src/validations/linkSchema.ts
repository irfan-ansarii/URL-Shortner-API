import * as z from "zod";

export const linkSchema = z
  .object({
    title: z
      .string({ required_error: "Title is a required filed" })
      .min(5, { message: "Title must be atleast 5 characters long" }),
    longUrl: z
      .string({ required_error: "Long url is a required field" })
      .url({ message: "Invalid url" }),
    shortId: z
      .union([
        z.string().regex(/^[a-zA-Z0-9]{2,}$/, {
          message:
            "Required at least 2 characters and consist of letters and numbers",
        }),
        z.undefined(),
      ])
      .transform((e) => (e === "" ? undefined : e)),
    comments: z
      .string({ invalid_type_error: "Comment must a string" })
      .optional(),
  })
  .strict();

export const updateLinkSchema = z
  .object({
    title: z
      .string({ required_error: "Title is a required filed" })
      .min(5, { message: "Title must be atleast 5 characters long" }),
    longUrl: z
      .string({ required_error: "Long url is a required field" })
      .url({ message: "Invalid url" }),
    status: z.enum(["active", "archived"], {
      required_error: "Status is a required field",
      invalid_type_error: "Status must be active or archived",
    }),
    comments: z
      .string({ invalid_type_error: "Comment must a string" })
      .optional(),
  })
  .strict();
