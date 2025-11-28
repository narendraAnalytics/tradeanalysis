'use server';

/**
 * Trade Analysis Server Actions
 *
 * Server-side functions for saving and retrieving trade analysis data
 * All functions automatically handle user authentication via Neon Auth
 */

import { db } from '@/db';
import { savedAnalyses } from '@/db/schema';
import { stackServerApp } from '@/stack/server';
import { eq, and, desc } from 'drizzle-orm';
import {
  CreateAnalysisInput,
  UpdateAnalysisInput,
  SavedTradeAnalysis,
} from '@/types/analysis';

// =============================================================================
// Helper: Get Current User
// =============================================================================

async function getCurrentUser() {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
}

// =============================================================================
// Create/Save Analysis
// =============================================================================

/**
 * Save a new trade analysis to the database
 *
 * @param input - Analysis data including query params and results
 * @returns The saved analysis with generated ID
 *
 * @example
 * const analysis = await saveTradeAnalysis({
 *   title: "India-China Trade 2020-2024",
 *   queryParams: {
 *     tradeType: "import",
 *     fromYear: 2020,
 *     toYear: 2024,
 *     countries: ["China"],
 *     sectors: ["Electronics"]
 *   },
 *   results: {
 *     executiveSummary: {...},
 *     pieCharts: [...],
 *     aiPredictions: [...]
 *   }
 * });
 */
export async function saveTradeAnalysis(
  input: CreateAnalysisInput
): Promise<SavedTradeAnalysis> {
  const user = await getCurrentUser();

  const [analysis] = await db
    .insert(savedAnalyses)
    .values({
      userId: user.id,
      title: input.title,
      description: input.description,
      queryParams: input.queryParams as any,
      results: input.results as any,
      isPublic: input.isPublic ?? false,
    })
    .returning();

  return {
    id: analysis.id,
    userId: analysis.userId,
    title: analysis.title,
    description: analysis.description ?? undefined,
    queryParams: analysis.queryParams as any,
    results: analysis.results as any,
    isPublic: analysis.isPublic ?? false,
    viewCount: analysis.viewCount ?? 0,
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
  };
}

// =============================================================================
// Get User's Analyses
// =============================================================================

/**
 * Get all saved analyses for the current user
 *
 * @returns Array of saved analyses, ordered by most recent first
 *
 * @example
 * const myAnalyses = await getUserAnalyses();
 * // Returns: [{ id: "...", title: "...", ... }]
 */
export async function getUserAnalyses(): Promise<SavedTradeAnalysis[]> {
  const user = await getCurrentUser();

  const analyses = await db
    .select()
    .from(savedAnalyses)
    .where(eq(savedAnalyses.userId, user.id))
    .orderBy(desc(savedAnalyses.createdAt));

  return analyses.map((a) => ({
    id: a.id,
    userId: a.userId,
    title: a.title,
    description: a.description ?? undefined,
    queryParams: a.queryParams as any,
    results: a.results as any,
    isPublic: a.isPublic ?? false,
    viewCount: a.viewCount ?? 0,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));
}

// =============================================================================
// Get Single Analysis by ID
// =============================================================================

/**
 * Get a specific analysis by ID
 * Only returns if the analysis belongs to the current user
 *
 * @param id - The analysis ID
 * @returns The analysis or null if not found
 *
 * @example
 * const analysis = await getAnalysisById("uuid-here");
 */
export async function getAnalysisById(
  id: string
): Promise<SavedTradeAnalysis | null> {
  const user = await getCurrentUser();

  const [analysis] = await db
    .select()
    .from(savedAnalyses)
    .where(and(eq(savedAnalyses.id, id), eq(savedAnalyses.userId, user.id)))
    .limit(1);

  if (!analysis) {
    return null;
  }

  return {
    id: analysis.id,
    userId: analysis.userId,
    title: analysis.title,
    description: analysis.description ?? undefined,
    queryParams: analysis.queryParams as any,
    results: analysis.results as any,
    isPublic: analysis.isPublic ?? false,
    viewCount: analysis.viewCount ?? 0,
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
  };
}

// =============================================================================
// Update Analysis
// =============================================================================

/**
 * Update an existing analysis
 * Useful for adding results to a saved query or updating title/description
 *
 * @param input - Update data including the analysis ID
 * @returns The updated analysis
 *
 * @example
 * const updated = await updateAnalysis({
 *   id: "uuid-here",
 *   title: "Updated Title",
 *   results: { ... }
 * });
 */
export async function updateAnalysis(
  input: UpdateAnalysisInput
): Promise<SavedTradeAnalysis> {
  const user = await getCurrentUser();

  // Build update object with only provided fields
  const updateData: any = {
    updatedAt: new Date(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.results !== undefined) updateData.results = input.results;
  if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;

  const [updated] = await db
    .update(savedAnalyses)
    .set(updateData)
    .where(and(eq(savedAnalyses.id, input.id), eq(savedAnalyses.userId, user.id)))
    .returning();

  if (!updated) {
    throw new Error('Analysis not found or unauthorized');
  }

  return {
    id: updated.id,
    userId: updated.userId,
    title: updated.title,
    description: updated.description ?? undefined,
    queryParams: updated.queryParams as any,
    results: updated.results as any,
    isPublic: updated.isPublic ?? false,
    viewCount: updated.viewCount ?? 0,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

// =============================================================================
// Delete Analysis
// =============================================================================

/**
 * Delete a saved analysis
 *
 * @param id - The analysis ID to delete
 * @returns True if deleted, false if not found
 *
 * @example
 * const deleted = await deleteAnalysis("uuid-here");
 */
export async function deleteAnalysis(id: string): Promise<boolean> {
  const user = await getCurrentUser();

  const result = await db
    .delete(savedAnalyses)
    .where(and(eq(savedAnalyses.id, id), eq(savedAnalyses.userId, user.id)))
    .returning();

  return result.length > 0;
}

// =============================================================================
// Get Recent Analyses (Dashboard Quick Access)
// =============================================================================

/**
 * Get the most recent analyses for quick access
 *
 * @param limit - Number of analyses to return (default: 5)
 * @returns Array of recent analyses
 *
 * @example
 * const recent = await getRecentAnalyses(3);
 * // Returns 3 most recent analyses
 */
export async function getRecentAnalyses(
  limit: number = 5
): Promise<SavedTradeAnalysis[]> {
  const user = await getCurrentUser();

  const analyses = await db
    .select()
    .from(savedAnalyses)
    .where(eq(savedAnalyses.userId, user.id))
    .orderBy(desc(savedAnalyses.createdAt))
    .limit(limit);

  return analyses.map((a) => ({
    id: a.id,
    userId: a.userId,
    title: a.title,
    description: a.description ?? undefined,
    queryParams: a.queryParams as any,
    results: a.results as any,
    isPublic: a.isPublic ?? false,
    viewCount: a.viewCount ?? 0,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));
}

// =============================================================================
// Increment View Count
// =============================================================================

/**
 * Increment the view count for an analysis
 * Useful for tracking which analyses are accessed most
 *
 * @param id - The analysis ID
 *
 * @example
 * await incrementViewCount("uuid-here");
 */
export async function incrementViewCount(id: string): Promise<void> {
  const user = await getCurrentUser();

  await db
    .update(savedAnalyses)
    .set({
      viewCount: (savedAnalyses.viewCount ?? 0) + 1,
    })
    .where(and(eq(savedAnalyses.id, id), eq(savedAnalyses.userId, user.id)));
}
