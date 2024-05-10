import { eq, and, asc, desc, count, getTableColumns } from "drizzle-orm";
import { db, findUnique } from "../../config/database";

import { clicks } from "../schemas/clicks";
import { links } from "../schemas/links";
import { PAGE_LIMIT } from "../../config/CONSTANTS";

export const createClick = async (params: Record<string, any>) => {
  return await db.insert(clicks).values(params).returning().then(findUnique);
};

export const findClick = async (id: any, params: any) => {
  const {
    userId,
  }: {
    userId: number;
  } = params;

  const results = await db
    .select({
      ...getTableColumns(clicks),
      link: {
        title: links.title,
        longUrl: links.longUrl,
        shortUrl: links.shortUrl,
        favicon: links.favicon,
        status: links.status,
      },
    })
    .from(clicks)
    .leftJoin(links, eq(links.id, clicks.linkId))
    .where(
      and(eq(clicks.id, id), userId ? eq(clicks.userId, userId) : undefined)
    )
    .then(findUnique);

  return results;
};

export const findClicks = async (params: any) => {
  const {
    userId,
    page = 1,
    limit = PAGE_LIMIT,
    sortBy = "createdAt",
    order = "desc",
  }: {
    userId: number;
    page: any;
    limit: number;
    order: "asc" | "desc";
    sortBy:
      | "ipAddress"
      | "country"
      | "state"
      | "referrer"
      | "browser"
      | "deviceType"
      | "operatingSystem"
      | "createdAt";
  } = params;

  const results = await db
    .select({
      ...getTableColumns(clicks),
      link: {
        title: links.title,
        longUrl: links.longUrl,
        shortUrl: links.shortUrl,
        favicon: links.favicon,
        status: links.status,
      },
    })
    .from(clicks)
    .leftJoin(links, eq(links.id, clicks.linkId))
    .where(and(userId ? eq(clicks.userId, userId) : undefined))
    .orderBy(order === "asc" ? asc(clicks[sortBy]) : desc(clicks[sortBy]))
    .limit(limit)
    .offset((page - 1) * limit);

  const records = await db
    .select({ total: count() })
    .from(clicks)
    .where(and(userId ? eq(clicks.userId, userId) : undefined))
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
