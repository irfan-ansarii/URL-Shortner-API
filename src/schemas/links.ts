import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  shortId: text("short_id").notNull(),
  longUrl: text("long_url").notNull(),
  shortUrl: text("short_url").notNull(),
  status: text("status")
    .$type<"active" | "archived">()
    .default("active")
    .notNull(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  favicon: text("favicon"),
  comments: text("messages"),
  clickCount: integer("click_count").default(0),
  lastClickedAt: timestamp("last_clicked_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
