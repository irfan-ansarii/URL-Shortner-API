import { eq } from "drizzle-orm";
import { db, findUnique } from "../../config/database";
import { users } from "../schemas/users";

/**
 *  update a user
 * @param params
 * @returns
 */
export const updateProfile = async (
  id: number,
  params: Record<string, any>
) => {
  const entity = await db
    .update(users)
    .set({ ...params })
    .where(eq(users.id, id))
    .returning()
    .then(findUnique);

  return entity;
};

/**
 *  update a user
 * @param params
 * @returns
 */
export const deleteProfile = async (id: number) => {
  const entity = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning()
    .then(findUnique);

  return entity;
};
