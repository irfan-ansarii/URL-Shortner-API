import * as z from "zod";

const events = z.enum(
  ["link.created", "link.updated", "link.deleted", "link.visited"],
  {
    errorMap: (issue, ctx) => {
      return {
        message: ctx.defaultError.replace("enum", "events"),
      };
    },
  }
);

export const webhookSchema = z
  .object({
    events: z.array(events, {
      required_error: "Events is a required field",
      invalid_type_error: "Events must be a array",
    }),
    url: z
      .string({ required_error: "URL is a required field" })
      .url({ message: "Invalid url" }),
    secret: z
      .string({ invalid_type_error: "Secret must be a string" })
      .min(1, { message: "Secret is a required field" }),
  })
  .strict();
