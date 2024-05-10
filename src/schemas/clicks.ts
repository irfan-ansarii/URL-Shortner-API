import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { links } from "./links";
import { users } from "./users";

export const clicks = pgTable("clicks", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").references(() => links.id, {
    onDelete: "cascade",
  }),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  country: text("country"),
  state: text("state"),
  browser: text("browser"),
  deviceType: text("device_type"),
  operatingSystem: text("operating_system"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
