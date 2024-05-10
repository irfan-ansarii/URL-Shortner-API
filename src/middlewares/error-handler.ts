import { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../core/ApplicationError";

const errorHandler = (
  error: ApplicationError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, name, message, details, ...rest } = error;

  return res.status(status).json({
    status,
    name,
    message,
    details,
  });
};

export { errorHandler };
