import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Minus,
  Play,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiamondIQLogo } from '@/components/DiamondIQLogo';
import { DrillPlayer } from '@/components/DrillPlayer';
import { STARTER_DATASET } from '@/data/starterDataset';
import { ScenarioProgress, AnswerQuality } from '@/types/drillSession';
import { applyResult } from '@/utils/drillEngine';
import { saveSessionToLocalStorage, loadSessionFromLocalStorage } from '@/utils/sessionPersistence';
import { ScenarioV2 } from '@/types/scenario';

type SortField = 'title' | 'passRate' | 'attempts' | 'lastDrilled' | 'status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'struggling' | 'learning' | 'mastered' | 'new';

interface ScenarioWithStats {
  scenario: ScenarioV2;
  progress: ScenarioProgress | null;
  passRate: number;
  totalAttempts: number;
  status: 'struggling' | 'learning' | 'mastered' | 'new';
}

/**
 * ProgressPage
 *
 * Dashboard showing detailed progress statistics:
 * - Overall performance metrics
 * - Scenario-level performance table
 * - Weak areas identification
 * - Mastery tracking
 */
export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('passRate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [practiceScenario, setPracticeScenario] = useState<ScenarioV2 | null>(null);
  const [sessionData, setSessionData] = useState(() => loadSessionFromLocalStorage());

  // Load session data
  const session = useMemo(() => sessionData, [sessionData]);

  // Calculate stats for each scenario
  const scenariosWithStats: ScenarioWithStats[] = useMemo(() => {
    return STARTER_DATASET.scenarios.map((scenario) => {
      const progress = session?.progress[scenario.id] || null;

      if (!progress || progress.repetitions === 0) {
        return {
          scenario,
          progress: null,
          passRate: -1, // Not attempted
          totalAttempts: 0,
          status: 'new' as const,
        };
      }

      const totalAttempts = progress.correct + progress.partial + progress.incorrect;
      const passRate = totalAttempts > 0 ? progress.correct / totalAttempts : 0;

      // Determine status based on pass rate and attempts
      let status: 'struggling' | 'learning' | 'mastered' | 'new';
      if (totalAttempts < 3) {
        status = 'learning';
      } else if (passRate >= 0.8) {
        status = 'mastered';
      } else if (passRate < 0.5) {
        status = 'struggling';
      } else {
        status = 'learning';
      }

      return {
        scenario,
        progress,
        passRate,
        totalAttempts,
        status,
      };
    });
  }, [session]);

  // Filter and sort scenarios
  const filteredAndSorted = useMemo(() => {
    let filtered = scenariosWithStats;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Sort
    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.scenario.title.localeCompare(b.scenario.title);
          break;
        case 'passRate':
          // Put "new" scenarios at the end when sorting by pass rate
          if (a.passRate === -1 && b.passRate === -1) comparison = 0;
          else if (a.passRate === -1) comparison = 1;
          else if (b.passRate === -1) comparison = -1;
          else comparison = a.passRate - b.passRate;
          break;
        case 'attempts':
          comparison = a.totalAttempts - b.totalAttempts;
          break;
        case 'lastDrilled':
          const aTime = a.progress?.lastShown || 0;
          const bTime = b.progress?.lastShown || 0;
          comparison = aTime - bTime;
          break;
        case 'status':
          const statusOrder = { struggling: 0, learning: 1, mastered: 2, new: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [scenariosWithStats, statusFilter, sortField, sortDirection]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const attempted = scenariosWithStats.filter((s) => s.totalAttempts > 0);
    const totalAttempts = attempted.reduce((sum, s) => sum + s.totalAttempts, 0);
    const totalCorrect = attempted.reduce(
      (sum, s) => sum + (s.progress?.correct || 0),
      0
    );

    const struggling = scenariosWithStats.filter((s) => s.status === 'struggling').length;
    const learning = scenariosWithStats.filter((s) => s.status === 'learning').length;
    const mastered = scenariosWithStats.filter((s) => s.status === 'mastered').length;
    const notStarted = scenariosWithStats.filter((s) => s.status === 'new').length;

    // Calculate current streak (consecutive correct answers across recent attempts)
    let currentStreak = 0;
    const recentAttempts = attempted
      .filter((s) => s.progress?.lastShown)
      .sort((a, b) => (b.progress?.lastShown || 0) - (a.progress?.lastShown || 0));

    for (const s of recentAttempts) {
      if (s.progress?.lastAnswer === 'best') {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalScenarios: scenariosWithStats.length,
      scenariosAttempted: attempted.length,
      totalAttempts,
      overallPassRate: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
      struggling,
      learning,
      mastered,
      notStarted,
      currentStreak,
    };
  }, [scenariosWithStats]);

  // Get weak areas (top 5 struggling scenarios)
  const weakAreas = useMemo(() => {
    return scenariosWithStats
      .filter((s) => s.totalAttempts >= 2 && s.passRate < 0.6)
      .sort((a, b) => a.passRate - b.passRate)
      .slice(0, 5);
  }, [scenariosWithStats]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'struggling':
        return <AlertTriangle size={16} color="#f44336" />;
      case 'learning':
        return <TrendingUp size={16} color="#ff9800" />;
      case 'mastered':
        return <CheckCircle size={16} color="#4caf50" />;
      default:
        return <Minus size={16} color="#9e9e9e" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'struggling':
        return 'error';
      case 'learning':
        return 'warning';
      case 'mastered':
        return 'success';
      default:
        return 'default';
    }
  };

  // Practice dialog handlers
  const handleStartPractice = (scenario: ScenarioV2) => {
    setPracticeScenario(scenario);
  };

  const handleClosePractice = () => {
    setPracticeScenario(null);
  };

  const handlePracticeAnswer = (quality: AnswerQuality) => {
    if (!practiceScenario || !sessionData) return;

    // Apply the result to session
    applyResult(sessionData, practiceScenario.id, quality);
    sessionData.updatedAt = Date.now();

    // Save to localStorage
    saveSessionToLocalStorage(sessionData);

    // Refresh session data to update stats
    setSessionData({ ...sessionData });

    // Close dialog after a brief moment
    setTimeout(() => {
      setPracticeScenario(null);
    }, 1500);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
          </Stack>
          <DiamondIQLogo />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
            Progress Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track your performance and identify areas for improvement.
          </Typography>
        </Box>

        {/* Overall Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Target size={24} color="#1976d2" />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {(overallStats.overallPassRate * 100).toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Overall Accuracy
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Clock size={24} color="#1976d2" />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {overallStats.totalAttempts}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Attempts
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Award size={24} color="#4caf50" />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {overallStats.mastered}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Scenarios Mastered
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp size={24} color="#ff9800" />
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {overallStats.currentStreak}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Current Streak
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Progress Breakdown */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Scenario Progress
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Mastered ({overallStats.mastered})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {((overallStats.mastered / overallStats.totalScenarios) * 100).toFixed(0)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(overallStats.mastered / overallStats.totalScenarios) * 100}
                  color="success"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Learning ({overallStats.learning})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {((overallStats.learning / overallStats.totalScenarios) * 100).toFixed(0)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(overallStats.learning / overallStats.totalScenarios) * 100}
                  color="warning"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Struggling ({overallStats.struggling})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {((overallStats.struggling / overallStats.totalScenarios) * 100).toFixed(0)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(overallStats.struggling / overallStats.totalScenarios) * 100}
                  color="error"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">
                    Not Started ({overallStats.notStarted})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {((overallStats.notStarted / overallStats.totalScenarios) * 100).toFixed(0)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(overallStats.notStarted / overallStats.totalScenarios) * 100}
                  sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: 'grey.400' } }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Weak Areas Alert */}
        {weakAreas.length > 0 && (
          <Alert
            severity="warning"
            icon={<AlertTriangle size={20} />}
            sx={{ mb: 4 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Areas Needing Practice
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Focus on these scenarios: {weakAreas.map((w) => w.scenario.title).join(', ')}
            </Typography>
          </Alert>
        )}

        {/* Scenario Table */}
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                All Scenarios ({filteredAndSorted.length})
              </Typography>
              <ToggleButtonGroup
                value={statusFilter}
                exclusive
                onChange={(_, value) => value && setStatusFilter(value)}
                size="small"
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="struggling">Struggling</ToggleButton>
                <ToggleButton value="learning">Learning</ToggleButton>
                <ToggleButton value="mastered">Mastered</ToggleButton>
                <ToggleButton value="new">New</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>

          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => handleSort('status')}
                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('title')}
                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                  >
                    Scenario {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('passRate')}
                    sx={{ cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}
                  >
                    Pass Rate {sortField === 'passRate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('attempts')}
                    sx={{ cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}
                  >
                    Attempts {sortField === 'attempts' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('lastDrilled')}
                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                  >
                    Last Drilled {sortField === 'lastDrilled' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSorted.map((item) => (
                  <TableRow
                    key={item.scenario.id}
                    hover
                    sx={{
                      bgcolor:
                        item.status === 'struggling'
                          ? 'error.50'
                          : item.status === 'mastered'
                          ? 'success.50'
                          : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Tooltip title={item.status.charAt(0).toUpperCase() + item.status.slice(1)}>
                        <Chip
                          icon={getStatusIcon(item.status)}
                          label={item.status}
                          size="small"
                          color={getStatusColor(item.status) as 'error' | 'warning' | 'success' | 'default'}
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.scenario.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.scenario.sport} · {item.scenario.level} · {item.scenario.difficulty || 'medium'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {item.passRate >= 0 ? (
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color:
                                item.passRate >= 0.8
                                  ? 'success.main'
                                  : item.passRate < 0.5
                                  ? 'error.main'
                                  : 'warning.main',
                            }}
                          >
                            {(item.passRate * 100).toFixed(0)}%
                          </Typography>
                          {item.progress && (
                            <Typography variant="caption" color="textSecondary">
                              ({item.progress.correct}/{item.totalAttempts})
                            </Typography>
                          )}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography variant="body2">
                        {item.totalAttempts || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(item.progress?.lastShown)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Play size={14} />}
                        onClick={() => handleStartPractice(item.scenario)}
                        color={item.status === 'struggling' ? 'warning' : 'primary'}
                      >
                        Practice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Quick Actions */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => navigate('/drill')}
          >
            Start Adaptive Drill
          </Button>
          {weakAreas.length > 0 && (
            <Button
              variant="outlined"
              color="warning"
              onClick={() => navigate('/')}
            >
              Practice Weak Areas
            </Button>
          )}
        </Stack>

        {/* Practice Dialog */}
        <Dialog
          open={!!practiceScenario}
          onClose={handleClosePractice}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { maxHeight: '95vh' } }}
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {practiceScenario?.title}
              </Typography>
              <IconButton onClick={handleClosePractice} size="small">
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            {practiceScenario && (
              <DrillPlayer
                scenario={practiceScenario}
                onAnswer={handlePracticeAnswer}
                isLoading={false}
              />
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};
