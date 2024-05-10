import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  events: text("events").array().notNull(),
  url: text("url").notNull(),
  secret: text("token").notNull(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
