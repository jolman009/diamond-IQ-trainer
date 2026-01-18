import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
} from '@mui/material';
import { LogOut, Diamond, ArrowLeft, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DrillPlayer } from '@/components/DrillPlayer';
import { FilterPanel } from '@/components/FilterPanel';
import { ScenarioV2, Sport, Level, Category, Position } from '@/types/scenario';
import { ScenarioFilter, createEmptyFilter } from '@/types/scenarioFilter';
import { DrillSession, createDrillSession } from '@/types/drillSession';
import { pickNextScenario, applyResult, getDrillStats } from '@/utils/drillEngine';
import { filterScenarios, getUniqueValues } from '@/utils/filterScenarios';
import { STARTER_DATASET } from '@/data/starterDataset';
import { useAuth } from '@/contexts/AuthContext';
import {
  saveSessionToLocalStorage,
  loadSessionFromLocalStorage,
  clearSessionFromLocalStorage,
} from '@/utils/sessionPersistence';
import {
  saveFilterToLocalStorage,
  loadFilterFromLocalStorage,
} from '@/utils/filterPersistence';

/**
 * AdaptiveDrillPage Container
 *
 * Manages:
 * 1. DrillSession state (progress, stats)
 * 2. Current scenario selection via pickNextScenario()
 * 3. Answer processing via applyResult()
 * 4. Stats display (correctRate, averageInterval, scenariosSeen)
 * 5. Session reset
 * 6. Scenario filtering (M5: sport, level, category, position)
 *
 * In M4, session persists to localStorage.
 * In M5, filter preferences persist to localStorage.
 * In M7, this will use Supabase backend.
 */
export const AdaptiveDrillPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [session, setSession] = useState<DrillSession | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ScenarioV2 | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noScenariosAvailable, setNoScenariosAvailable] = useState(false);
  const [filter, setFilter] = useState<ScenarioFilter>(createEmptyFilter());
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    void navigate('/login');
  };

  // Get filtered scenarios based on current filter
  const filteredScenarios = filterScenarios(STARTER_DATASET.scenarios, filter);

  // Load session and filter preferences from localStorage on mount
  useEffect(() => {
    const saved = loadSessionFromLocalStorage();
    const activeSession = saved || createDrillSession('adaptive-session');
    setSession(activeSession);

    const savedFilter = loadFilterFromLocalStorage();
    setFilter(savedFilter);
  }, []);

  // Pick first scenario when session or filtered scenarios change
  useEffect(() => {
    if (session) {
      const next = pickNextScenario(filteredScenarios, session);
      if (next) {
        setCurrentScenario(next);
        setNoScenariosAvailable(false);
      } else {
        setNoScenariosAvailable(true);
      }
    }
  }, [session, filteredScenarios]);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      saveSessionToLocalStorage(session);
    }
  }, [session]);

  // Save filter to localStorage whenever it changes and pick next scenario
  useEffect(() => {
    void saveFilterToLocalStorage(filter);

    // When filter changes, pick next scenario from filtered list
    if (session) {
      const next = pickNextScenario(filteredScenarios, session);
      if (next) {
        setCurrentScenario(next);
        setNoScenariosAvailable(false);
      } else {
        setNoScenariosAvailable(true);
      }
    }
  }, [filter, filteredScenarios, session]);

  const handleAnswer = (quality: 'best' | 'ok' | 'bad' | 'timeout') => {
    if (!currentScenario || !session) return;

    setIsLoading(true);

    // Simulate network latency for reveal animation
    setTimeout(() => {
      // Apply result and update session
      applyResult(session, currentScenario.id, quality);

      // Update session state (this triggers save via useEffect)
      setSession({ ...session });

      // Pick next scenario from filtered list
      const next = pickNextScenario(filteredScenarios, session);
      if (next) {
        setCurrentScenario(next);
        setNoScenariosAvailable(false);
      } else {
        setNoScenariosAvailable(true);
      }

      setIsLoading(false);
    }, 300);
  };

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    clearSessionFromLocalStorage();
    const newSession = createDrillSession('adaptive-session');
    setSession(newSession);
    const next = pickNextScenario(filteredScenarios, newSession);
    if (next) {
      setCurrentScenario(next);
      setNoScenariosAvailable(false);
    }
    setResetDialogOpen(false);
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
  };

  const stats = session ? getDrillStats(filteredScenarios, session) : { correctRate: 0, scenariosSeen: 0, totalAttempts: 0, averageEase: 1.3, averageInterval: 0, currentStreak: 0, bestStreak: 0 };

  // Get unique values for filter dropdowns
  const sports = getUniqueValues(STARTER_DATASET.scenarios, 'sport') as Sport[];
  const levels = getUniqueValues(STARTER_DATASET.scenarios, 'level') as Level[];
  const categories = getUniqueValues(STARTER_DATASET.scenarios, 'category') as Category[];
  const positions = getUniqueValues(STARTER_DATASET.scenarios, 'position') as Position[];

  const handleFilterChange = (newFilter: ScenarioFilter) => {
    setFilter(newFilter);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header with User Info */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                <Diamond size={32} color="#1976d2" strokeWidth={2.5} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Diamond IQ
                </Typography>
              </Stack>
              <Typography variant="body1" color="textSecondary">
                Improve your in-game decision-making with spaced repetition drills.
              </Typography>
            </Box>
            <Stack spacing={1} alignItems="flex-end">
              {/* Back to Dashboard Button */}
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                startIcon={<ArrowLeft size={18} />}
                sx={{ mb: 1 }}
              >
                Back to Dashboard
              </Button>
              {user && (
                <>
                  <Typography variant="caption" color="textSecondary">
                    Signed in as
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user.email}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleLogout}
                    startIcon={<LogOut size={16} />}
                    sx={{ mt: 1 }}
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
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
                      <Typography variant="h6" sx={{ fontWeight: 700, color: stats.currentStreak > 0 ? 'warning.main' : 'text.secondary' }}>
                        {stats.currentStreak}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">streak</Typography>
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
                    <LinearProgress
                      variant="determinate"
                      value={stats.correctRate * 100}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
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
          <Button
            variant="text"
            color="inherit"
            onClick={handleResetClick}
            sx={{ fontWeight: 600, textDecoration: 'underline' }}
          >
            Reset Session
          </Button>
        </Box>

        {/* Reset Confirmation Dialog */}
        <Dialog open={resetDialogOpen} onClose={handleResetCancel}>
          <DialogTitle>Reset Session?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will clear all your progress, including your {stats.totalAttempts} attempts,{' '}
              {stats.scenariosSeen} scenarios seen, and your best streak of {stats.bestStreak}.
              This action cannot be undone.
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
      </Container>
    </Box>
  );
};
