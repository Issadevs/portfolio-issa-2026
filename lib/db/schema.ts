import { pgTable, text, boolean, date, timestamp } from "drizzle-orm/pg-core";

export const portfolioSettings = pgTable("portfolio_settings", {
  id:               text("id").primaryKey(),
  status:           text("status").notNull(),
  contract_type:    text("contract_type").notNull(),
  available_from:   date("available_from", { mode: "string" }),
  location:         text("location").notNull(),
  show_contact_cta: boolean("show_contact_cta").notNull(),
  headline_fr:      text("headline_fr").notNull(),
  headline_en:      text("headline_en").notNull(),
  note_fr:          text("note_fr").notNull(),
  note_en:          text("note_en").notNull(),
  updated_at:       timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});

export type PortfolioSettingsRow = typeof portfolioSettings.$inferSelect;
export type NewPortfolioSettingsRow = typeof portfolioSettings.$inferInsert;
