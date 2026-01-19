import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DrillSession, ScenarioProgress } from '@/types/drillSession';
import { batchSaveProgress, updateBestStreak, loadOrCreateSession } from './sessionService';

const LOCAL_STORAGE_SESSION_KEY = 'adaptive-trainer-session';
const MIGRATION_COMPLETED_KEY = 'adaptive-trainer-migration-completed';

export interface MigrationStats {
  totalAttempts: number;
  scenarioCount: number;
  bestStreak: number;
}

/**
 * Migration Service
 *
 * Handles migrating localStorage data to Supabase when users first sign up
 * or log in with existing local data.
 */

/**
 * Check if there's localStorage data that can be migrated
 */
export function hasLocalStorageData(): boolean {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (!stored) return false;

    const session = JSON.parse(stored) as DrillSession;
    // Has data if there's any progress
    return Object.keys(session.progress || {}).length > 0;
  } catch {
    return false;
  }
}

/**
 * Check if migration has already been completed for this user
 */
export function hasMigrationCompleted(userId: string): boolean {
  try {
    const migrationData = localStorage.getItem(MIGRATION_COMPLETED_KEY);
    if (!migrationData) return false;

    const completed = JSON.parse(migrationData) as Record<string, boolean>;
    return completed[userId] === true;
  } catch {
    return false;
  }
}

/**
 * Mark migration as completed for a user
 */
function markMigrationCompleted(userId: string): void {
  try {
    const migrationData = localStorage.getItem(MIGRATION_COMPLETED_KEY);
    const completed = migrationData ? JSON.parse(migrationData) : {};
    completed[userId] = true;
    localStorage.setItem(MIGRATION_COMPLETED_KEY, JSON.stringify(completed));
  } catch (error) {
    console.error('Failed to mark migration completed:', error);
  }
}

/**
 * Get stats about the localStorage data for display to user
 */
export function getLocalStorageStats(): MigrationStats | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as DrillSession;
    const progress = session.progress || {};

    let totalAttempts = 0;
    for (const p of Object.values(progress)) {
      totalAttempts += p.correct + p.incorrect + p.partial + p.timeouts;
    }

    return {
      totalAttempts,
      scenarioCount: Object.keys(progress).length,
      bestStreak: session.bestStreak || 0,
    };
  } catch {
    return null;
  }
}

/**
 * Get localStorage session data
 */
export function getLocalStorageSession(): DrillSession | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as DrillSession;
  } catch {
    return null;
  }
}

/**
 * Migrate localStorage data to Supabase
 * Can either merge with existing cloud data or replace it
 */
export async function migrateToSupabase(
  userId: string,
  mode: 'merge' | 'replace'
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const localSession = getLocalStorageSession();
    if (!localSession) {
      return { success: false, error: 'No local data to migrate' };
    }

    // Get or create cloud session
    const cloudSession = await loadOrCreateSession(userId);

    // Prepare progress data to save
    let progressToSave: Record<string, ScenarioProgress>;
    let bestStreak: number;

    if (mode === 'replace') {
      // Use local data as-is
      progressToSave = localSession.progress;
      bestStreak = localSession.bestStreak || 0;

      // Clear existing cloud progress first
      const { error: deleteError } = await supabase
        .from('scenario_progress')
        .delete()
        .eq('session_id', cloudSession.id);

      if (deleteError) {
        console.error('Error clearing cloud progress:', deleteError);
      }
    } else {
      // Merge: for each scenario, take the one with more attempts
      progressToSave = { ...cloudSession.progress };

      for (const [scenarioId, localProgress] of Object.entries(localSession.progress)) {
        const cloudProgress = cloudSession.progress[scenarioId];

        if (!cloudProgress) {
          // Scenario only exists locally, use it
          progressToSave[scenarioId] = localProgress;
        } else {
          // Both exist, take the one with more repetitions
          const localReps = localProgress.repetitions || 0;
          const cloudReps = cloudProgress.repetitions || 0;

          if (localReps > cloudReps) {
            progressToSave[scenarioId] = localProgress;
          }
          // else keep cloud data (already in progressToSave)
        }
      }

      // Take the higher best streak
      bestStreak = Math.max(
        localSession.bestStreak || 0,
        cloudSession.bestStreak || 0
      );
    }

    // Save all progress to Supabase
    await batchSaveProgress(userId, cloudSession.id, progressToSave);

    // Update best streak
    await updateBestStreak(cloudSession.id, bestStreak);

    // Mark migration as completed
    markMigrationCompleted(userId);

    // Clear localStorage session data (keep migration flag)
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);

    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed',
    };
  }
}

/**
 * Skip migration and keep using cloud data only
 */
export function skipMigration(userId: string): void {
  markMigrationCompleted(userId);
}

/**
 * Check if user needs to be prompted for migration
 */
export function shouldPromptMigration(userId: string): boolean {
  return (
    isSupabaseConfigured &&
    hasLocalStorageData() &&
    !hasMigrationCompleted(userId)
  );
}
