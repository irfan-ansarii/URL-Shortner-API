import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import { logger } from "../src/core/Logger";

import { DATABASE_URL } from "./CONSTANTS";

const client = new Client({
  connectionString: DATABASE_URL,
});

export const db = (() => {
  client
    .connect()
    .then(() => {
      logger.info("Connected to the database");
    })
    .catch((err) => {
      logger.error("Failed to connect to the database.");
      logger.error(new Error("Failed to connect to the database."));
      process.exit(0);
    });
  return drizzle(client, { logger: false });
})();

export const findUnique = <T>(values: T[]): T => {
  return values[0]!;
};
