import { NextFunction, Request, Response } from "express";

import { deleteProfile, updateProfile } from "../services/profile";
import { ApplicationError } from "../core/ApplicationError";

/**
 * update profile
 * @param req @default
 * @param res @default
 */
const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;

  const response = await updateProfile(id, req.body);

  if (!response) {
    const err = new ApplicationError("Something went wrong", 400);
    return next(err);
  }

  res.status(200).json({ data: response });
};

/**
 * delete profile
 * @param req @default
 * @param res @default
 */
const deleteProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;

  const response = await deleteProfile(id);

  if (!response) {
    const err = new ApplicationError("Something went wrong", 400);
    return next(err);
  }
  res.status(200).json({ data: response });
};

export { updateProfileController, deleteProfileController };
