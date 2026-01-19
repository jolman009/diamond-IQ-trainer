import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DrillSession, ScenarioProgress, createDrillSession } from '@/types/drillSession';
import {
  DrillSessionRow,
  ScenarioProgressRow,
  ScenarioProgressInsert,
} from '@/types/supabase';

/**
 * Session Service
 *
 * Handles CRUD operations for drill sessions and scenario progress.
 * Falls back to localStorage when Supabase is not configured.
 */

// Convert Supabase row to local DrillSession format
function mapRowsToSession(
  sessionRow: DrillSessionRow,
  progressRows: ScenarioProgressRow[]
): DrillSession {
  const progress: Record<string, ScenarioProgress> = {};

  for (const row of progressRows) {
    progress[row.scenario_id] = {
      scenarioId: row.scenario_id,
      lastShown: row.last_shown ? new Date(row.last_shown).getTime() : 0,
      lastAnswer: row.last_answer as ScenarioProgress['lastAnswer'],
      correct: row.correct,
      incorrect: row.incorrect,
      partial: row.partial,
      timeouts: row.timeouts,
      interval: row.interval_days * 24 * 60 * 60 * 1000, // Convert days to ms
      ease: row.ease,
      nextDue: new Date(row.next_due).getTime(),
      repetitions: row.repetitions,
    };
  }

  return {
    id: sessionRow.id,
    createdAt: new Date(sessionRow.created_at).getTime(),
    updatedAt: new Date(sessionRow.updated_at).getTime(),
    progress,
    bestStreak: sessionRow.best_streak,
  };
}

// Convert local ScenarioProgress to Supabase insert format
function mapProgressToInsert(
  userId: string,
  sessionId: string,
  scenarioId: string,
  progress: ScenarioProgress
): ScenarioProgressInsert {
  return {
    user_id: userId,
    session_id: sessionId,
    scenario_id: scenarioId,
    correct: progress.correct,
    incorrect: progress.incorrect,
    partial: progress.partial,
    timeouts: progress.timeouts,
    repetitions: progress.repetitions,
    interval_days: progress.interval / (24 * 60 * 60 * 1000), // Convert ms to days
    ease: progress.ease,
    next_due: new Date(progress.nextDue).toISOString(),
    last_shown: progress.lastShown ? new Date(progress.lastShown).toISOString() : null,
    last_answer: progress.lastAnswer,
  };
}

/**
 * Load or create a drill session for the current user
 */
export async function loadOrCreateSession(userId: string): Promise<DrillSession> {
  if (!isSupabaseConfigured) {
    // Fall back to localStorage
    const stored = localStorage.getItem('adaptive-trainer-session');
    if (stored) {
      try {
        return JSON.parse(stored) as DrillSession;
      } catch {
        // Invalid data, create new
      }
    }
    return createDrillSession('local-session');
  }

  // Check for existing session
  const { data: sessionData, error: sessionError } = await supabase
    .from('drill_sessions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (sessionError && sessionError.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Error loading session:', sessionError);
    throw new Error('Failed to load session');
  }

  let sessionRow: DrillSessionRow;

  if (!sessionData) {
    // Create new session
    const { data: newSession, error: createError } = await supabase
      .from('drill_sessions')
      .insert({ user_id: userId })
      .select()
      .single();

    if (createError || !newSession) {
      console.error('Error creating session:', createError);
      throw new Error('Failed to create session');
    }

    sessionRow = newSession;
  } else {
    sessionRow = sessionData;
  }

  // Load scenario progress
  const { data: progressData, error: progressError } = await supabase
    .from('scenario_progress')
    .select('*')
    .eq('session_id', sessionRow.id);

  if (progressError) {
    console.error('Error loading progress:', progressError);
    throw new Error('Failed to load progress');
  }

  return mapRowsToSession(sessionRow, progressData || []);
}

/**
 * Save scenario progress to Supabase (upsert)
 */
export async function saveScenarioProgress(
  userId: string,
  sessionId: string,
  scenarioId: string,
  progress: ScenarioProgress
): Promise<void> {
  if (!isSupabaseConfigured) {
    // Already handled by localStorage in sync service
    return;
  }

  const insertData = mapProgressToInsert(userId, sessionId, scenarioId, progress);

  const { error } = await supabase
    .from('scenario_progress')
    .upsert(insertData, {
      onConflict: 'user_id,scenario_id',
    });

  if (error) {
    console.error('Error saving progress:', error);
    throw new Error('Failed to save progress');
  }
}

/**
 * Batch save multiple scenario progress entries
 */
export async function batchSaveProgress(
  userId: string,
  sessionId: string,
  progressEntries: Record<string, ScenarioProgress>
): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  const insertData = Object.entries(progressEntries).map(([scenarioId, progress]) =>
    mapProgressToInsert(userId, sessionId, scenarioId, progress)
  );

  if (insertData.length === 0) return;

  const { error } = await supabase
    .from('scenario_progress')
    .upsert(insertData, {
      onConflict: 'user_id,scenario_id',
    });

  if (error) {
    console.error('Error batch saving progress:', error);
    throw new Error('Failed to save progress');
  }
}

/**
 * Update session best streak
 */
export async function updateBestStreak(
  sessionId: string,
  bestStreak: number
): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  const { error } = await supabase
    .from('drill_sessions')
    .update({ best_streak: bestStreak, updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating best streak:', error);
  }
}

/**
 * Reset session (delete all progress)
 */
export async function resetSession(_userId: string, sessionId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localStorage.removeItem('adaptive-trainer-session');
    return;
  }

  // Delete all progress for this session
  const { error: progressError } = await supabase
    .from('scenario_progress')
    .delete()
    .eq('session_id', sessionId);

  if (progressError) {
    console.error('Error deleting progress:', progressError);
  }

  // Reset session aggregates
  const { error: sessionError } = await supabase
    .from('drill_sessions')
    .update({
      total_attempts: 0,
      total_correct: 0,
      best_streak: 0,
      scenarios_mastered: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (sessionError) {
    console.error('Error resetting session:', sessionError);
  }
}
