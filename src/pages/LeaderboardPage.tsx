import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
} from '@mui/material';
import { Trophy, Target, Flame, Award, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LeaderboardEntry } from '@/types/supabase';
import {
  fetchLeaderboard,
  getUserRank,
  LeaderboardSortField,
} from '@/services/leaderboardService';

type TabValue = 'accuracy' | 'streaks' | 'mastered';

const TAB_TO_SORT: Record<TabValue, LeaderboardSortField> = {
  accuracy: 'accuracy_pct',
  streaks: 'best_streak',
  mastered: 'scenarios_mastered',
};

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>('accuracy');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{ rank: number; entry: LeaderboardEntry } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const loadLeaderboard = async (sortField: LeaderboardSortField, pageNum: number, refresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchLeaderboard(sortField, pageNum, refresh);

      if (pageNum === 0) {
        setEntries(result.entries);
      } else {
        setEntries((prev) => [...prev, ...result.entries]);
      }
      setHasMore(result.hasMore);

      // Get current user's rank
      if (user) {
        const rank = await getUserRank(user.id, sortField);
        setUserRank(rank);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    loadLeaderboard(TAB_TO_SORT[activeTab], 0);
  }, [activeTab, user]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadLeaderboard(TAB_TO_SORT[activeTab], nextPage);
  };

  const handleRefresh = () => {
    setPage(0);
    loadLeaderboard(TAB_TO_SORT[activeTab], 0, true);
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <Trophy size={20} color="#FFD700" />;
    if (rank === 2) return <Trophy size={20} color="#C0C0C0" />;
    if (rank === 3) return <Trophy size={20} color="#CD7F32" />;
    return rank;
  };

  const getStatValue = (entry: LeaderboardEntry): string | number => {
    switch (activeTab) {
      case 'accuracy':
        return `${entry.accuracy_pct}%`;
      case 'streaks':
        return entry.best_streak;
      case 'mastered':
        return entry.scenarios_mastered;
      default:
        return '';
    }
  };

  const getStatLabel = (): string => {
    switch (activeTab) {
      case 'accuracy':
        return 'Accuracy';
      case 'streaks':
        return 'Best Streak';
      case 'mastered':
        return 'Mastered';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Leaderboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            See how you rank against other players.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshCw size={16} />}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      {/* Current User Rank Card */}
      {userRank && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  #{userRank.rank}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Your Rank
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {userRank.entry.display_name || 'You'}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Chip
                    icon={<Target size={14} />}
                    label={`${userRank.entry.accuracy_pct}% Accuracy`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Flame size={14} />}
                    label={`${userRank.entry.best_streak} Streak`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Award size={14} />}
                    label={`${userRank.entry.scenarios_mastered} Mastered`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab
            icon={<Target size={18} />}
            iconPosition="start"
            label="Accuracy"
            value="accuracy"
          />
          <Tab
            icon={<Flame size={18} />}
            iconPosition="start"
            label="Streaks"
            value="streaks"
          />
          <Tab
            icon={<Award size={18} />}
            iconPosition="start"
            label="Mastered"
            value="mastered"
          />
        </Tabs>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Leaderboard Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 80 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Player</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>{getStatLabel()}</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Attempts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="textSecondary">
                      No leaderboard entries yet. Complete at least 10 attempts to appear!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry, index) => {
                  const rank = page * 50 + index + 1;
                  const isCurrentUser = user?.id === entry.user_id;

                  return (
                    <TableRow
                      key={entry.user_id}
                      sx={{
                        bgcolor: isCurrentUser ? 'primary.50' : rank <= 3 ? 'action.hover' : 'inherit',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: rank <= 3 ? 700 : 400 }}>
                          {getRankDisplay(rank)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                            {(entry.display_name ?? '?')[0]?.toUpperCase() ?? '?'}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: isCurrentUser ? 700 : 500 }}
                            >
                              {entry.display_name || 'Anonymous'}
                              {isCurrentUser && (
                                <Chip label="You" size="small" sx={{ ml: 1 }} color="primary" />
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color:
                              activeTab === 'accuracy'
                                ? entry.accuracy_pct >= 80
                                  ? 'success.main'
                                  : entry.accuracy_pct < 50
                                  ? 'error.main'
                                  : 'warning.main'
                                : 'text.primary',
                          }}
                        >
                          {getStatValue(entry)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="textSecondary">
                          {entry.total_attempts}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Load More */}
        {hasMore && (
          <Box sx={{ p: 2, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Minimum Attempts Notice */}
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
        Players need at least 10 attempts to appear on the leaderboard.
      </Typography>
    </Box>
  );
};
