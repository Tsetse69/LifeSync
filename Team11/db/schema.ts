import { doublePrecision, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

// One row per planner item. Ids are generated in the browser, so they are only unique per user.
export const items = pgTable(
  "items",
  {
    userId: text("user_id").notNull(),
    id: text().notNull(),
    title: text().notNull(),
    category: text().notNull(),
    date: text().notNull(), // YYYY-MM-DD in the user's local time
    amount: doublePrecision(), // USD, null for non-expenses
    priority: text().notNull().default("Normal"),
    reminder: text().notNull().default("none"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.id] })],
);
