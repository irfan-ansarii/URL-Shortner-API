import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../core/ApplicationError";

const asyncHandler = (fn: Function) =>
  async function asyncHanldlerWrap(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const fnReturn = fn(req, res, next);

    return Promise.resolve(fnReturn).catch((err) => {
      console.log(err);
      const error = new ApplicationError("Async Handler Error", 400);
      next(error);
    });
  };

export { asyncHandler };
