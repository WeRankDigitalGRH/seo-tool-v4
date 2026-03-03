import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  varchar,
  index,
} from "drizzle-orm/pg-core";

export const audits = pgTable(
  "audits",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 2048 }).notNull(),
    normalizedUrl: varchar("normalized_url", { length: 2048 }).notNull(),
    overallScore: integer("overall_score").notNull(),
    summary: text("summary"),
    categories: jsonb("categories").notNull(),
    topPriorities: jsonb("top_priorities"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_audits_url").on(table.normalizedUrl),
    index("idx_audits_created").on(table.createdAt),
  ]
);

export const auditCategories = pgTable(
  "audit_categories",
  {
    id: serial("id").primaryKey(),
    auditId: integer("audit_id")
      .references(() => audits.id, { onDelete: "cascade" })
      .notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    score: integer("score").notNull(),
    issueCount: integer("issue_count").notNull().default(0),
    criticalCount: integer("critical_count").notNull().default(0),
    warningCount: integer("warning_count").notNull().default(0),
  },
  (table) => [index("idx_categories_audit").on(table.auditId)]
);

export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;
export type AuditCategory = typeof auditCategories.$inferSelect;
