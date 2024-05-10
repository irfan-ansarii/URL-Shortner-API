import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../core/ApplicationError";

export const handler = (req: Request, res: Response, next: NextFunction) => {
  const err = new ApplicationError("Not Found", 404);
  return next(err);
};
