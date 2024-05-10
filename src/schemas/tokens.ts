import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  token: text("token"),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  lastUsedAt: timestamp("last_used_at"),
  expireAt: timestamp("expire_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
