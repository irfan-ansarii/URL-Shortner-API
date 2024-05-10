import { desc, eq, and } from "drizzle-orm";
import { db, findUnique } from "../../config/database";
import { tokens } from "../schemas/tokens";

interface CreateProps {
  name: string;
  token: string;
  userId: number;
}

/**
 * create token
 * @param values
 * @returns
 */
export const createToken = async (values: CreateProps) => {
  return await db.insert(tokens).values(values).returning().then(findUnique);
};

/**
 * find tokens
 * @param params
 * @returns
 */
export const findManyTokens = async (params: Record<string, any>) => {
  const { userId = undefined } = params;

  return await db
    .select()
    .from(tokens)
    .where(userId ? eq(tokens.userId, userId) : undefined)
    .orderBy(desc(tokens.id));
};

/**
 * find token by id
 * @param id
 * @param params
 * @returns
 */
export const findToken = async (id: any, params: Record<string, any>) => {
  const { userId = undefined } = params;

  return await db
    .select()
    .from(tokens)
    .where(
      and(eq(tokens.id, id), userId ? eq(tokens.userId, userId) : undefined)
    )
    .then(findUnique);
};

/**
 * update token by id
 * @param id
 * @param params
 * @returns
 */
export const updateToken = async (id: any, params: Record<string, any>) => {
  return await db
    .update(tokens)
    .set({ ...params })
    .where(eq(tokens.id, id))
    .returning()
    .then(findUnique);
};

/**
 * delete token
 * @param id
 * @param params
 * @returns
 */
export const deleteToken = async (id: any) => {
  return await db
    .delete(tokens)
    .where(eq(tokens.id, id))
    .returning()
    .then(findUnique);
};
