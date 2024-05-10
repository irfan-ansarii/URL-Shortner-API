import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../core/ApplicationError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decodeJwt } from "../services/auth";
import { findToken, updateToken } from "../services/tokens";

declare global {
  namespace Express {
    interface Request {
      session?: any;
      user?: any;
    }
  }
}

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("Authorization");

  const token = authorization?.replace("Bearer ", "");

  if (!authorization || !authorization.startsWith("Bearer" || !token)) {
    const error = new ApplicationError("Missing authorization token", 401);
    return next(error);
  }

  try {
    const { payload, user } = await decodeJwt(token!);

    await handleToken(payload);

    if (!user) {
      const err = new ApplicationError("Invalid authorization token", 401);
      return next(err);
    }

    req.user = {
      ...user,
    };

    return next();
  } catch (error) {
    let err = new ApplicationError(
      "Missing or invalid authorization token",
      401
    );

    if (error instanceof jwt.TokenExpiredError) {
      err = new ApplicationError("Authorization has expired", 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      err = new ApplicationError("Invalid authorization token", 401);
    }

    return next(err);
  }
};

const handleToken = async (decoded: JwtPayload) => {
  const tokenId = decoded.tokenId;

  if (!tokenId) return;

  const token = await findToken(tokenId, {});

  if (!token || (token.expireAt && new Date(token.expireAt) <= new Date())) {
    throw jwt.TokenExpiredError;
  }

  await updateToken(token.id, {
    lastUsedAt: new Date(),
  });
};
