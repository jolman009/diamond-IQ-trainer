/**
 * Supabase Database Types
 *
 * These types match the database schema defined in supabase-schema.sql.
 * Update this file when the schema changes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      drill_sessions: {
        Row: {
          id: string;
          user_id: string;
          total_attempts: number;
          total_correct: number;
          best_streak: number;
          scenarios_mastered: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_attempts?: number;
          total_correct?: number;
          best_streak?: number;
          scenarios_mastered?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          total_attempts?: number;
          total_correct?: number;
          best_streak?: number;
          scenarios_mastered?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'drill_sessions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      scenario_progress: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          scenario_id: string;
          correct: number;
          incorrect: number;
          partial: number;
          timeouts: number;
          repetitions: number;
          interval_days: number;
          ease: number;
          next_due: string;
          last_shown: string | null;
          last_answer: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          scenario_id: string;
          correct?: number;
          incorrect?: number;
          partial?: number;
          timeouts?: number;
          repetitions?: number;
          interval_days?: number;
          ease?: number;
          next_due?: string;
          last_shown?: string | null;
          last_answer?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          correct?: number;
          incorrect?: number;
          partial?: number;
          timeouts?: number;
          repetitions?: number;
          interval_days?: number;
          ease?: number;
          next_due?: string;
          last_shown?: string | null;
          last_answer?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'scenario_progress_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'scenario_progress_session_id_fkey';
            columns: ['session_id'];
            referencedRelation: 'drill_sessions';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      leaderboard_stats: {
        Row: {
          user_id: string;
          display_name: string | null;
          accuracy_pct: number;
          best_streak: number;
          scenarios_mastered: number;
          total_attempts: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      update_session_aggregates: {
        Args: { p_session_id: string };
        Returns: void;
      };
      refresh_leaderboard: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: {
      answer_quality: 'best' | 'ok' | 'bad' | 'timeout';
    };
  };
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type DrillSessionRow = Database['public']['Tables']['drill_sessions']['Row'];
export type DrillSessionInsert = Database['public']['Tables']['drill_sessions']['Insert'];
export type DrillSessionUpdate = Database['public']['Tables']['drill_sessions']['Update'];

export type ScenarioProgressRow = Database['public']['Tables']['scenario_progress']['Row'];
export type ScenarioProgressInsert = Database['public']['Tables']['scenario_progress']['Insert'];
export type ScenarioProgressUpdate = Database['public']['Tables']['scenario_progress']['Update'];

export type LeaderboardEntry = Database['public']['Views']['leaderboard_stats']['Row'];
