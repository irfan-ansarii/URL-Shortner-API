import { eq, and, count, sql, gte, lte } from "drizzle-orm";
import { db } from "../../config/database";
import { clicks } from "../schemas/clicks";
import { INTERVAL_MAP } from "../../config/CONSTANTS";

export const findAnalytic = async (id: any, params: any) => {
  const {
    groupBy = "createdAt",
    userId,
    interval = "24h",
  }: {
    userId: number;
    groupBy:
      | "ipAddress"
      | "country"
      | "state"
      | "referrer"
      | "browser"
      | "deviceType"
      | "operatingSystem"
      | "createdAt";
    interval: string;
  } = params;

  const map = INTERVAL_MAP[interval];

  const filters = and(
    gte(clicks.createdAt, sql`current_timestamp - ${map.start}::interval`),
    eq(clicks.userId, userId),
    eq(clicks.linkId, id)
  );
  const results = await db
    .select({
      name: clicks[groupBy],
      clickCount: count(),
    })
    .from(clicks)
    .where(filters)
    .groupBy(clicks[groupBy]);

  return results;
};

export const findAnalytics = async (params: any) => {
  const {
    groupBy = "createdAt",
    userId,
    interval = "24h",
  }: {
    userId: number;
    interval: string;
    groupBy:
      | "ipAddress"
      | "country"
      | "state"
      | "referrer"
      | "browser"
      | "deviceType"
      | "operatingSystem"
      | "createdAt";
  } = params;

  const map = INTERVAL_MAP[interval];

  const filters = and(
    gte(clicks.createdAt, sql`current_timestamp - ${map.start}::interval`),
    eq(clicks.userId, userId)
  );

  const results = await db
    .select({
      name: clicks[groupBy],
      clickCount: count(),
    })
    .from(clicks)
    .where(filters)
    .groupBy(clicks[groupBy]);

  return results;
};

export const findTimeSeries = async (id: any, params: any) => {
  console.log(id, params);
  const { interval = "24h", userId }: { interval: string; userId: number } =
    params;
  const map = INTERVAL_MAP[interval];

  const results = await db
    .select({
      name: sql`day`,
      clickCount: count(clicks.id),
    })
    .from(
      sql`generate_series(
          current_timestamp - ${map.start}::interval,
          current_timestamp, 
          ${map.interval}) as day`
    )
    .leftJoin(
      clicks,
      and(
        gte(clicks.createdAt, sql`day`),
        lte(clicks.createdAt, sql`day + ${map.interval}::interval`),
        eq(clicks.userId, userId),
        id ? eq(clicks.linkId, id) : undefined
      )
    )
    .groupBy(({ name }) => name)
    .orderBy(({ name }) => name);

  return results;
};
