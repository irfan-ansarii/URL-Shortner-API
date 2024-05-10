// import { drizzle } from "drizzle-orm/node-postgres";
// import { migrate } from "drizzle-orm/node-postgres/migrator";
// import { Client } from "pg";
// import { DATABASE_URL } from "./CONSTANTS";

// const client = new Client({
//   connectionString: DATABASE_URL,
// });

// export const db = (() => {
//   client
//     .connect()
//     .then(() => {
//       console.log("Connected to the database");
//     })
//     .catch((err) => {
//       console.error("Failed to connect to the database:", err);
//     });
//   return drizzle(client, { logger: true });
// })();

// (async () => {
//   console.log("Migration started...");

//   await migrate(db, { migrationsFolder: "drizzle" });

//   console.log("Migration completed...");
//   process.exit(0);
// })();

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

const db = drizzle(sql);

(async () => {
  console.log("Migration started...");

  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migration completed...");
  process.exit(0);
})();
