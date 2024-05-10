import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApplicationError } from "../core/ApplicationError";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      let err = new ApplicationError("Internal Server Error", 500);

      if (error instanceof ZodError) {
        const errors = error.errors.map((issue: any) => {
          const { code, keys, path, message } = issue;

          const isUnknown = code === "unrecognized_keys";

          return {
            fields: isUnknown ? keys : path,
            message: isUnknown ? `Unknown field(s)` : message,
          };
        });

        err = new ApplicationError("Validation Failed", 400, {
          errors,
        });
      }
      next(err);
    }
  };
}
