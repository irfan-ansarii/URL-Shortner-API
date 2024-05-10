import { Request, Response, NextFunction } from "express";
import {
  createToken,
  deleteToken,
  findManyTokens,
  findToken,
  updateToken,
} from "../services/tokens";

import { ApplicationError } from "../core/ApplicationError";
import { signJwt } from "../services/auth";
import { formatToken, getExpiryDate } from "../lib/utils";
import { sendEmail } from "../lib/email";

export const createTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user, body } = req;

  body.userId = user.id;
  body.expireAt = getExpiryDate(body.expiresIn);

  const result = await createToken(body);

  const payload = {
    id: user.id,
    email: user.email,
    tokenId: result.id,
  };

  const token = signJwt(payload, body.expiresIn);
  body.token = token;

  const updated = await updateToken(result.id, {
    token,
  });

  /** send api created email to user */
  await sendEmail(user.email!, "API Token created", "token", {});

  return res.status(201).json({
    data: updated,
  });
};

/**
 * find all links
 * @param req @default
 * @param res @default
 */
export const findTokensController = async (req: Request, res: Response) => {
  const { user, query } = req;

  const results = await findManyTokens({
    ...query,
    userId: user.id,
  });

  // encode token
  const parsed = results.map((result) => ({
    ...result,
    token: formatToken(result.token!),
  }));

  res.status(200).json({ data: parsed });
};

/**
 * find link by id
 * @param req @default
 * @param res @default
 */
export const findTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params, user } = req;

  const response = await findToken(params.id, { userId: user.id });

  if (!response) {
    const err = new ApplicationError("Token Not Found", 404);
    return next(err);
  }

  return res.status(200).json({
    data: {
      ...response,
      token: formatToken(response.token!),
    },
  });
};

/**
 * update token by id
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params, user } = req;

  const response = await findToken(params.id, { userId: user.id });

  if (!response) {
    const err = new ApplicationError("Token Not Found", 404);
    return next(err);
  }

  if (response.expireAt && new Date(response.expireAt) <= new Date()) {
    const err = new ApplicationError("Token is already deactivated", 400);
    return next(err);
  }

  const result = await updateToken(params.id, {
    expireAt: new Date(),
  });

  return res.status(200).json({
    data: result,
  });
};

/**
 * delete token by id
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const deleteTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params, user } = req;

  const response = await findToken(params.id, { userId: user.id });
  if (!response) {
    const err = new ApplicationError("Token Not Found", 404);
    return next(err);
  }

  const result = await deleteToken(params.id);

  return res.status(200).json({
    data: result,
  });
};
