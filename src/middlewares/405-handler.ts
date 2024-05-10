import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../core/ApplicationError";

export const handler = (req: Request, res: Response, next: NextFunction) => {
  const err = new ApplicationError("Method Not Allowed", 405);

  return next(err);
};
