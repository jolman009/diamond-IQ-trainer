import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LeaderboardEntry } from '@/types/supabase';

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 50;

export type LeaderboardSortField = 'accuracy_pct' | 'best_streak' | 'scenarios_mastered';

interface CacheEntry {
  data: LeaderboardEntry[];
  timestamp: number;
  sortField: LeaderboardSortField;
}

let cache: CacheEntry | null = null;

/**
 * Leaderboard Service
 *
 * Fetches and caches leaderboard data from Supabase.
 * Uses a 5-minute client-side cache to reduce queries.
 */

/**
 * Fetch leaderboard with pagination
 */
export async function fetchLeaderboard(
  sortField: LeaderboardSortField = 'accuracy_pct',
  page: number = 0,
  forceRefresh: boolean = false
): Promise<{ entries: LeaderboardEntry[]; hasMore: boolean }> {
  if (!isSupabaseConfigured) {
    return { entries: [], hasMore: false };
  }

  // Check cache
  if (
    !forceRefresh &&
    cache &&
    cache.sortField === sortField &&
    Date.now() - cache.timestamp < CACHE_DURATION_MS
  ) {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return {
      entries: cache.data.slice(start, end),
      hasMore: cache.data.length > end,
    };
  }

  try {
    // Fetch all entries (limited to reasonable amount for caching)
    const { data, error } = await supabase
      .from('leaderboard_stats')
      .select('*')
      .order(sortField, { ascending: false })
      .order('total_attempts', { ascending: false })
      .limit(500);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }

    // Update cache
    cache = {
      data: data || [],
      timestamp: Date.now(),
      sortField,
    };

    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return {
      entries: cache.data.slice(start, end),
      hasMore: cache.data.length > end,
    };
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    throw error;
  }
}

/**
 * Get current user's rank
 */
export async function getUserRank(
  userId: string,
  sortField: LeaderboardSortField = 'accuracy_pct'
): Promise<{ rank: number; entry: LeaderboardEntry } | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  // Ensure cache is populated
  if (!cache || cache.sortField !== sortField) {
    await fetchLeaderboard(sortField);
  }

  if (!cache) return null;

  const index = cache.data.findIndex((entry) => entry.user_id === userId);
  if (index === -1) return null;

  const entry = cache.data[index];
  if (!entry) return null;

  return {
    rank: index + 1,
    entry,
  };
}

/**
 * Clear the leaderboard cache
 */
export function clearLeaderboardCache(): void {
  cache = null;
}

/**
 * Trigger a refresh of the leaderboard materialized view
 * (Should be called sparingly, e.g., after significant progress updates)
 */
export async function refreshLeaderboardView(): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.rpc('refresh_leaderboard');
  } catch (error) {
    console.error('Failed to refresh leaderboard view:', error);
  }
}
