import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "./CONSTANTS";

export default {
  schema: "./src/schemas",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL!,
  },
  verbose: true,
  strict: false,
} satisfies Config;
