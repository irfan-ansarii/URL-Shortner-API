import { NextFunction, Request, Response } from "express";

import {
  createOrUpdateUser,
  decodeJwt,
  generateOTP,
  getUser,
  insertOTP,
  signJwt,
} from "../services/auth";

import { ApplicationError } from "../core/ApplicationError";
import { sendEmail } from "../lib/email";

/**
 * signin controller
 * @param req {Request}
 * @param res {Response}
 * @param next {NextFunction}
 * @returns {Response}
 */
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, status } = await createOrUpdateUser(req.body);

  if (status === "blocked") {
    const err = new ApplicationError("Account Blocked", 403);
    next(err);
  }

  const code = generateOTP();

  await insertOTP({ email: email!, otp: code });

  /** send otp via email */
  await sendEmail(email!, "One-Time Password", "otp", { otp: code });

  return res.status(200).json({
    data: { success: true, email },
  });
};

/**
 * verify OTP controller
 * @param req {Request}
 * @param res {Response}
 * @param next {NextFunction}
 * @returns {Response}
 */
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp } = req.body;

  const user = await getUser({ email: email! });

  if (!user.otp) {
    const error = new ApplicationError("Unauthorized", 401);
    return next(error);
  }

  if (user.otp !== otp) {
    const error = new ApplicationError("Invalid OTP", 400);
    return next(error);
  }

  // remove otp once the user has logged in
  await insertOTP({ email: email!, otp: "" });

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = signJwt(payload, "7d");

  return res.status(200).json({
    token,
    data: user,
  });
};

/**
 * get session
 * @param req {Request}
 * @param res {Response}
 * @param next {NextFunction}
 * @returns {Response}
 */
export const session = async (req: Request, res: Response) => {
  const authorization = req.header("Authorization");

  const token = authorization?.replace("Bearer ", "");

  const { payload, user } = await decodeJwt(token!);

  return res.status(200).json({
    data: user,
  });
};
