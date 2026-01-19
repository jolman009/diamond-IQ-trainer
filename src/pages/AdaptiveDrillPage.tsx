import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Snackbar,
} from '@mui/material';
import { Flame, Cloud, CloudOff } from 'lucide-react';
import { DrillPlayer } from '@/components/DrillPlayer';
import { FilterPanel } from '@/components/FilterPanel';
import { ScenarioV2, Sport, Level, Category, Position } from '@/types/scenario';
import { ScenarioFilter, createEmptyFilter } from '@/types/scenarioFilter';
import { DrillSession, createDrillSession } from '@/types/drillSession';
import { pickNextScenario, applyResult, getDrillStats } from '@/utils/drillEngine';
import { filterScenarios, getUniqueValues } from '@/utils/filterScenarios';
import { STARTER_DATASET } from '@/data/starterDataset';
import { saveFilterToLocalStorage, loadFilterFromLocalStorage } from '@/utils/filterPersistence';
import { useAuth } from '@/contexts/AuthContext';
import { syncService } from '@/services/syncService';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * AdaptiveDrillPage Container
 *
 * Manages drill session with cloud sync support.
 * Falls back to localStorage when Supabase is not configured.
 */
export const AdaptiveDrillPage: React.FC = () => {
  const { user } = useAuth();
  const [session, setSession] = useState<DrillSession | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ScenarioV2 | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [noScenariosAvailable, setNoScenariosAvailable] = useState(false);
  const [filter, setFilter] = useState<ScenarioFilter>(createEmptyFilter());
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Get filtered scenarios based on current filter
  const filteredScenarios = filterScenarios(STARTER_DATASET.scenarios, filter);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      setIsInitializing(true);
      try {
        let activeSession: DrillSession;

        if (user && isSupabaseConfigured) {
          // Load from Supabase
          activeSession = await syncService.initialize(user.id);
        } else {
          // Load from localStorage
          const saved = syncService.loadFromLocalStorage();
          activeSession = saved || createDrillSession('local-session');
        }

        setSession(activeSession);
        syncService.saveToLocalStorage(activeSession);
      } catch (error) {
        console.error('Failed to initialize session:', error);
        // Fall back to localStorage
        const saved = syncService.loadFromLocalStorage();
        setSession(saved || createDrillSession('local-session'));
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();

    // Load filter preferences
    const savedFilter = loadFilterFromLocalStorage();
    setFilter(savedFilter);

    // Subscribe to sync status
    const unsubscribe = syncService.onSyncStatusChange(setIsSyncing);
    return () => unsubscribe();
  }, [user]);

  // Pick scenario when session or filter changes
  useEffect(() => {
    if (session && !isInitializing) {
      const next = pickNextScenario(filteredScenarios, session);
      if (next) {
        setCurrentScenario(next);
        setNoScenariosAvailable(false);
      } else {
        setNoScenariosAvailable(true);
      }
    }
  }, [session, filteredScenarios, isInitializing]);

  // Save filter to localStorage when it changes
  useEffect(() => {
    if (!isInitializing) {
      void saveFilterToLocalStorage(filter);
    }
  }, [filter, isInitializing]);

  const handleAnswer = useCallback(
    (quality: 'best' | 'ok' | 'bad' | 'timeout') => {
      if (!currentScenario || !session) return;

      setIsLoading(true);

      setTimeout(() => {
        // Apply result and update session
        applyResult(session, currentScenario.id, quality);
        session.updatedAt = Date.now();

        const updatedProgress = session.progress[currentScenario.id];

        // Queue for cloud sync
        if (updatedProgress) {
          syncService.queueProgressUpdate(currentScenario.id, updatedProgress);
        }

        // Check if best streak needs updating
        const stats = getDrillStats(filteredScenarios, session);
        if (session.bestStreak === undefined || stats.bestStreak > (session.bestStreak || 0)) {
          session.bestStreak = stats.bestStreak;
          syncService.queueBestStreakUpdate(stats.bestStreak);
        }

        // Always save to localStorage immediately
        syncService.saveToLocalStorage(session);

        // Update state
        setSession({ ...session });

        // Pick next scenario
        const next = pickNextScenario(filteredScenarios, session);
        if (next) {
          setCurrentScenario(next);
          setNoScenariosAvailable(false);
        } else {
          setNoScenariosAvailable(true);
        }

        setIsLoading(false);
      }, 300);
    },
    [currentScenario, session, filteredScenarios]
  );

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = async () => {
    try {
      await syncService.reset();
      const newSession = createDrillSession('local-session');
      setSession(newSession);
      syncService.saveToLocalStorage(newSession);

      const next = pickNextScenario(filteredScenarios, newSession);
      if (next) {
        setCurrentScenario(next);
        setNoScenariosAvailable(false);
      }
    } catch (error) {
      console.error('Failed to reset session:', error);
      setSyncError('Failed to reset session. Please try again.');
    }
    setResetDialogOpen(false);
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
  };

  const handleFilterChange = (newFilter: ScenarioFilter) => {
    setFilter(newFilter);
  };

  const stats = session
    ? getDrillStats(filteredScenarios, session)
    : {
        correctRate: 0,
        scenariosSeen: 0,
        totalAttempts: 0,
        averageEase: 1.3,
        averageInterval: 0,
        currentStreak: 0,
        bestStreak: 0,
      };

  // Get unique values for filter dropdowns
  const sports = getUniqueValues(STARTER_DATASET.scenarios, 'sport') as Sport[];
  const levels = getUniqueValues(STARTER_DATASET.scenarios, 'level') as Level[];
  const categories = getUniqueValues(STARTER_DATASET.scenarios, 'category') as Category[];
  const positions = getUniqueValues(STARTER_DATASET.scenarios, 'position') as Position[];

  if (isInitializing) {
    return (
      <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="textSecondary">Loading your session...</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            IQ Training
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sharpen your baseball instincts with spaced repetition drills.
          </Typography>
        </Box>
        {/* Sync Status Indicator */}
        {isSupabaseConfigured && (
          <Chip
            icon={isSyncing ? <Cloud size={16} /> : <CloudOff size={16} />}
            label={isSyncing ? 'Syncing...' : 'Synced'}
            size="small"
            variant="outlined"
            color={isSyncing ? 'primary' : 'default'}
            sx={{ opacity: isSyncing ? 1 : 0.6 }}
          />
        )}
      </Box>

      {/* Filter Panel */}
      <FilterPanel
        filter={filter}
        onFilterChange={handleFilterChange}
        sports={sports}
        levels={levels}
        categories={categories}
        positions={positions}
        scenarioCount={filteredScenarios.length}
      />

      {/* Session Stats Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'stretch', sm: 'center' }}>
            {/* Current Streak - Highlighted */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<Flame size={18} color={stats.currentStreak > 0 ? '#ff6b35' : undefined} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: stats.currentStreak > 0 ? 'warning.main' : 'text.secondary' }}
                    >
                      {stats.currentStreak}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      streak
                    </Typography>
                  </Box>
                }
                variant={stats.currentStreak > 0 ? 'filled' : 'outlined'}
                sx={{
                  bgcolor: stats.currentStreak > 0 ? 'warning.lighter' : 'transparent',
                  borderColor: stats.currentStreak > 0 ? 'warning.main' : 'divider',
                  height: 'auto',
                  py: 0.5,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
              {stats.bestStreak > 0 && (
                <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
                  Best: {stats.bestStreak}
                </Typography>
              )}
            </Box>

            {/* Correct Rate */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                ACCURACY
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={stats.correctRate * 100} sx={{ height: 8, borderRadius: 1 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, minWidth: '60px' }}>
                  {(stats.correctRate * 100).toFixed(0)}%
                </Typography>
              </Box>
            </Box>

            {/* Scenarios Seen */}
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                SCENARIOS SEEN
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.scenariosSeen}
              </Typography>
            </Box>

            {/* Total Attempts */}
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                TOTAL ATTEMPTS
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.totalAttempts}
              </Typography>
            </Box>

            {/* Average Ease */}
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                AVG DIFFICULTY
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.averageEase.toFixed(2)}x
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* No Scenarios Alert */}
      {noScenariosAvailable && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            All scenarios are rested. Come back later to keep drilling!
          </Typography>
          <Button variant="outlined" size="small" onClick={handleResetClick} sx={{ mt: 1 }}>
            Start New Session
          </Button>
        </Alert>
      )}

      {/* Drill Player */}
      {currentScenario && !noScenariosAvailable && (
        <DrillPlayer
          scenario={currentScenario}
          onAnswer={handleAnswer}
          isLoading={isLoading}
          currentStreak={stats.currentStreak}
        />
      )}

      {/* Reset Session Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="text" color="inherit" onClick={handleResetClick} sx={{ fontWeight: 600, textDecoration: 'underline' }}>
          Reset Session
        </Button>
      </Box>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onClose={handleResetCancel}>
        <DialogTitle>Reset Session?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear all your progress, including your {stats.totalAttempts} attempts, {stats.scenariosSeen} scenarios
            seen, and your best streak of {stats.bestStreak}. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} color="error" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sync Error Snackbar */}
      <Snackbar
        open={!!syncError}
        autoHideDuration={5000}
        onClose={() => setSyncError(null)}
        message={syncError}
      />
    </Box>
  );
};
