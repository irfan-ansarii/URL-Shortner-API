import { eq } from "drizzle-orm";
import jwt, { JwtPayload } from "jsonwebtoken";
import speakeasy from "speakeasy";

import { db, findUnique } from "../../config/database";
import { users } from "../schemas/users";
import { ApplicationError } from "../core/ApplicationError";
import { JWT_SECRET } from "../../config/CONSTANTS";
/**
 * create or update a user
 * @param params
 * @returns
 */
export const createOrUpdateUser = async (params: Record<string, any>) => {
  const entity = await db
    .insert(users)
    .values({ ...params })
    .onConflictDoUpdate({
      target: users.email,
      set: { ...params },
    })
    .returning()
    .then(findUnique);

  return entity;
};

/**
 * update otp field on users
 * @param params
 * @returns
 */
export const insertOTP = async (params: { email: string; otp: string }) => {
  const { email, otp } = params;
  const res = await db
    .update(users)
    .set({ otp: otp })
    .where(eq(users.email, email));

  if (!res) {
    throw new ApplicationError("Could not send otp", 400);
  }

  return res;
};

/**
 * retrive a users by email
 * @param params
 * @returns
 */
export const getUser = async (params: Record<string, any>) => {
  const { email, id } = params;
  return await db
    .select()
    .from(users)
    .where(email ? eq(users.email, email) : eq(users.id, id))
    .then(findUnique);
};

/** generate 6 digit otp */
export const generateOTP = () => {
  const secret = speakeasy.generateSecret({ length: 20 });

  return speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });
};

/** sign jwt token  */
export const signJwt = (
  payload: { id: number; email: any },
  expiresIn?: string
) => {
  const options: jwt.SignOptions = {};

  if (expiresIn) {
    options.expiresIn = expiresIn;
  }

  const token = jwt.sign(payload, JWT_SECRET!, options);

  return token;
};

/** decode jwt token */
export const decodeJwt = async (
  token: string
): Promise<{ payload: JwtPayload; user: any }> => {
  const decoded = jwt.verify(token!, JWT_SECRET!) as JwtPayload;

  const user = await getUser({ id: decoded.id });

  return { payload: decoded, user };
};
