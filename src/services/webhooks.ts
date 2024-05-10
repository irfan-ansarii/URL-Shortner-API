import { desc, eq, and } from "drizzle-orm";
import { db, findUnique } from "../../config/database";
import { webhooks } from "../schemas/webhooks";

interface CreateProps {
  events: string[];
  url: string;
  userId: number;
  secret: string;
}

/**
 * create webhook
 * @param values
 * @returns
 */
export const createWebhook = async (values: CreateProps) => {
  return await db.insert(webhooks).values(values).returning().then(findUnique);
};

/**
 * find webhooks
 * @param params
 * @returns
 */
export const findWebhooks = async (params: Record<string, any>) => {
  const { userId = undefined } = params;

  return await db
    .select()
    .from(webhooks)
    .where(userId ? eq(webhooks.userId, userId) : undefined)
    .orderBy(desc(webhooks.id));
};

/**
 * find webhook by id
 * @param id
 * @param params
 * @returns
 */
export const findWebhook = async (id: any, params: Record<string, any>) => {
  const { userId = undefined } = params;

  return await db
    .select()
    .from(webhooks)
    .where(
      and(eq(webhooks.id, id), userId ? eq(webhooks.userId, userId) : undefined)
    )
    .then(findUnique);
};

/**
 * update webhook by id
 * @param id
 * @param params
 * @returns
 */
export const updateWebhook = async (id: any, params: Record<string, any>) => {
  return await db
    .update(webhooks)
    .set({ ...params })
    .where(eq(webhooks.id, id))
    .returning()
    .then(findUnique);
};

/**
 * delete webhook
 * @param id
 * @param params
 * @returns
 */
export const deleteWebhook = async (id: any) => {
  return await db
    .delete(webhooks)
    .where(eq(webhooks.id, id))
    .returning()
    .then(findUnique);
};
