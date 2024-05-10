import {
  and,
  desc,
  asc,
  eq,
  getTableColumns,
  or,
  ilike,
  count,
  sum,
  avg,
} from "drizzle-orm";

import { db, findUnique } from "../../config/database";
import { links } from "../schemas/links";
import { PAGE_LIMIT } from "../../config/CONSTANTS";

interface CreateProps {
  title: string;
  shortId: string;
  longUrl: string;
  shortUrl: string;
  status: "active" | "archived";
  comments: string | undefined;
  userId: number;
  clickCount: number;
}
/** create link */
export const createLink = async (params: CreateProps) => {
  return await db.insert(links).values(params).returning().then(findUnique);
};

/** find links */
export const findLinks = async (params: any) => {
  const {
    q,
    userId,
    page = 1,
    limit = PAGE_LIMIT,
    sortBy = "createdAt",
    order = "desc",
  }: {
    q: string;
    page: any;
    limit: number;
    userId: number;
    order: "asc" | "desc";
    sortBy: "createdAt" | "title" | "shortUrl" | "longUrl" | "clickCount";
  } = params;

  const { userId: exclude, ...restFields } = getTableColumns(links);

  const filters = and(
    eq(links.userId, userId),
    q
      ? or(
          ilike(links.title, `%${q}%`),
          ilike(links.longUrl, `%${q}%`),
          ilike(links.shortUrl, `%${q}%`),
          ilike(links.comments, `%${q}%`)
        )
      : undefined
  );

  const results = await db
    .select(restFields)
    .from(links)
    .where(filters)
    .orderBy(order === "asc" ? asc(links[sortBy]) : desc(links[sortBy]))
    .limit(limit)
    .offset((page - 1) * limit);

  const records = await db
    .select({ total: count() })
    .from(links)
    .where(filters)
    .then(findUnique);

  return {
    data: results,
    meta: {
      page: parseInt(page),
      size: limit,
      pages: Math.ceil(records.total / limit),
      ...records,
    },
  };
};

/** find link */
export const findLink = async (id: any, params?: Record<string, any>) => {
  const { userId } = params || {};

  const { userId: exclude, ...restFields } = getTableColumns(links);

  const result = await db
    .select(restFields)
    .from(links)
    .where(and(eq(links.id, id)))
    .then(findUnique);

  return result;
};

/** find link by short id */
export const findLinkByShortId = async (shortId: string) => {
  const result = await db
    .select()
    .from(links)
    .where(eq(links.shortId, shortId))
    .then(findUnique);

  return result;
};

/** find link summary*/
export const findLinksSummary = async (params?: Record<string, any>) => {
  const { userId } = params || {};

  const result = await db
    .select({
      totalCount: count(),
      clickCount: sum(links.clickCount),
      averageClick: avg(links.clickCount),
    })
    .from(links)
    .where(userId ? eq(links.userId, userId) : undefined)
    .then(findUnique);

  return result;
};

/** update link */
export const updateLink = async (id: any, params: Record<string, any>) => {
  const result = await db
    .update(links)
    .set({ ...params })
    .where(eq(links.id, id))
    .returning()
    .then(findUnique);

  return result;
};

/** delete link */
export const deleteLink = async (id: any) => {
  const result = await db
    .delete(links)
    .where(eq(links.id, id))
    .returning()
    .then(findUnique);

  return result;
};
