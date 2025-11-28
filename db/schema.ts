import { pgTable, text, timestamp, uuid, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { usersSync } from 'drizzle-orm/neon';

/**
 * Neon Auth Users Table (Auto-managed by Neon Auth)
 *
 * This is a reference to the automatically synchronized user table.
 * DO NOT modify this table directly - it's managed by Neon Auth.
 *
 * Columns available:
 * - id: text (Primary Key) - Unique user identifier
 * - name: text - User's display name
 * - email: text - User's email address
 * - rawJson: jsonb - Complete user profile data
 * - createdAt: timestamp - When user signed up
 * - updatedAt: timestamp - Last profile update
 * - deletedAt: timestamp - Soft delete timestamp
 *
 * Reference: https://orm.drizzle.team/docs/neon-auth
 */
export { usersSync };

/**
 * User Preferences Table
 * Stores user-specific settings and preferences for the dashboard
 */
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Foreign key to neon_auth.users_sync
  userId: text('user_id')
    .notNull()
    .references(() => usersSync.id, { onDelete: 'cascade' }),

  // Preference fields
  theme: text('theme').default('light'), // 'light' | 'dark'
  defaultView: text('default_view').default('overview'), // Dashboard default view
  notifications: boolean('notifications').default(true),
  emailAlerts: boolean('email_alerts').default(false),

  // Dashboard preferences stored as JSON
  dashboardConfig: jsonb('dashboard_config'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Saved Trade Analyses Table
 * Stores user-saved trade analysis queries and reports
 */
export const savedAnalyses = pgTable('saved_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Foreign key to neon_auth.users_sync
  userId: text('user_id')
    .notNull()
    .references(() => usersSync.id, { onDelete: 'cascade' }),

  // Analysis details
  title: text('title').notNull(),
  description: text('description'),

  // Query parameters stored as JSON
  queryParams: jsonb('query_params').notNull(), // Stores filter/search criteria

  // Analysis results (optional - can be regenerated)
  results: jsonb('results'),

  // Metadata
  isPublic: boolean('is_public').default(false),
  viewCount: integer('view_count').default(0),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Trade Bookmarks Table
 * Stores bookmarked trade data points for quick access
 */
export const tradeBookmarks = pgTable('trade_bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Foreign key to neon_auth.users_sync
  userId: text('user_id')
    .notNull()
    .references(() => usersSync.id, { onDelete: 'cascade' }),

  // Bookmark details
  title: text('title').notNull(),
  notes: text('notes'),

  // Trade data reference
  tradeDataId: text('trade_data_id'), // External reference to trade dataset
  tradeData: jsonb('trade_data').notNull(), // Snapshot of the trade data

  // Category/tags
  category: text('category'), // e.g., 'imports', 'exports', 'specific-country'
  tags: text('tags').array(), // Array of custom tags

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * User Activity Log Table
 * Tracks user interactions for analytics and insights
 */
export const userActivityLog = pgTable('user_activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Foreign key to neon_auth.users_sync
  userId: text('user_id')
    .notNull()
    .references(() => usersSync.id, { onDelete: 'cascade' }),

  // Activity details
  activityType: text('activity_type').notNull(), // 'search', 'view', 'export', 'bookmark'
  activityData: jsonb('activity_data'), // Additional context

  // Session info
  sessionId: text('session_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  // Timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =============================================================================
// TypeScript Types
// =============================================================================

/**
 * Inferred types for TypeScript usage
 * Use these types when working with the database in your application
 */

// User types (from Neon Auth)
export type User = typeof usersSync.$inferSelect;

// User Preferences types
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;

// Saved Analyses types
export type SavedAnalysis = typeof savedAnalyses.$inferSelect;
export type NewSavedAnalysis = typeof savedAnalyses.$inferInsert;

// Trade Bookmarks types
export type TradeBookmark = typeof tradeBookmarks.$inferSelect;
export type NewTradeBookmark = typeof tradeBookmarks.$inferInsert;

// User Activity Log types
export type UserActivity = typeof userActivityLog.$inferSelect;
export type NewUserActivity = typeof userActivityLog.$inferInsert;
