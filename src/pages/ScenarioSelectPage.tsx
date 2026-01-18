import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Play, Circle, CircleDot, Zap, LogOut, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScenarioV2, Position, PositionEnum } from '@/types/scenario';
import { STARTER_DATASET } from '@/data/starterDataset';
import { DrillPlayer } from '@/components/DrillPlayer';
import { DiamondIQLogo } from '@/components/DiamondIQLogo';
import { useAuth } from '@/contexts/AuthContext';

type BaseConfiguration =
  | 'bases-empty'
  | 'runner-1b'
  | 'runner-2b'
  | 'runner-3b'
  | 'runners-1b-2b'
  | 'runners-1b-3b'
  | 'runners-2b-3b'
  | 'bases-loaded';

interface BaseOption {
  id: BaseConfiguration;
  label: string;
  runners: ('1b' | '2b' | '3b')[];
  description: string;
}

const BASE_OPTIONS: BaseOption[] = [
  { id: 'bases-empty', label: 'Bases Empty', runners: [], description: 'No runners on base' },
  { id: 'runner-1b', label: 'Runner on 1st', runners: ['1b'], description: 'Runner on first base only' },
  { id: 'runner-2b', label: 'Runner on 2nd', runners: ['2b'], description: 'Runner on second base only' },
  { id: 'runner-3b', label: 'Runner on 3rd', runners: ['3b'], description: 'Runner on third base only' },
  { id: 'runners-1b-2b', label: '1st & 2nd', runners: ['1b', '2b'], description: 'Runners on first and second' },
  { id: 'runners-1b-3b', label: '1st & 3rd', runners: ['1b', '3b'], description: 'Runners on first and third' },
  { id: 'runners-2b-3b', label: '2nd & 3rd', runners: ['2b', '3b'], description: 'Runners on second and third' },
  { id: 'bases-loaded', label: 'Bases Loaded', runners: ['1b', '2b', '3b'], description: 'Runners on all bases' },
];

const POSITION_LABELS: Record<Position, string> = {
  c: 'Catcher',
  p: 'Pitcher',
  '1b': 'First Base',
  '2b': 'Second Base',
  '3b': 'Third Base',
  ss: 'Shortstop',
  lf: 'Left Field',
  cf: 'Center Field',
  rf: 'Right Field',
  dh: 'DH',
};

/**
 * ScenarioSelectPage
 *
 * Allows users to browse and select scenarios by:
 * - Base runner configuration (8 options)
 * - Number of outs (0, 1, 2)
 * - Position where the ball was hit
 *
 * Users can then start a drill with a specific scenario.
 */
export const ScenarioSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    void navigate('/login');
  };

  // Filter state
  const [selectedBase, setSelectedBase] = useState<BaseConfiguration | null>(null);
  const [selectedOuts, setSelectedOuts] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Drill state
  const [activeScenario, setActiveScenario] = useState<ScenarioV2 | null>(null);
  const [showDrill, setShowDrill] = useState(false);

  // Get all available positions from scenarios
  const availablePositions = useMemo(() => {
    const positions = new Set<Position>();
    STARTER_DATASET.scenarios.forEach((s) => {
      if (s.position) positions.add(s.position);
    });
    return Array.from(positions).sort((a, b) => {
      const order = PositionEnum.options;
      return order.indexOf(a) - order.indexOf(b);
    });
  }, []);

  // Filter scenarios based on selections
  const filteredScenarios = useMemo(() => {
    return STARTER_DATASET.scenarios.filter((scenario) => {
      // Filter by base configuration
      if (selectedBase) {
        const baseOption = BASE_OPTIONS.find((b) => b.id === selectedBase);
        if (baseOption) {
          const scenarioRunners = [...scenario.runners].sort();
          const targetRunners = [...baseOption.runners].sort();
          if (JSON.stringify(scenarioRunners) !== JSON.stringify(targetRunners)) {
            return false;
          }
        }
      }

      // Filter by outs
      if (selectedOuts !== null && scenario.outs !== selectedOuts) {
        return false;
      }

      // Filter by position
      if (selectedPosition && scenario.position !== selectedPosition) {
        return false;
      }

      return true;
    });
  }, [selectedBase, selectedOuts, selectedPosition]);

  // Get counts for each filter option
  const baseCounts = useMemo(() => {
    const counts: Record<BaseConfiguration, number> = {} as Record<BaseConfiguration, number>;
    BASE_OPTIONS.forEach((opt) => {
      counts[opt.id] = STARTER_DATASET.scenarios.filter((s) => {
        const scenarioRunners = [...s.runners].sort();
        const targetRunners = [...opt.runners].sort();
        return JSON.stringify(scenarioRunners) === JSON.stringify(targetRunners);
      }).length;
    });
    return counts;
  }, []);

  const handleBaseSelect = (base: BaseConfiguration) => {
    setSelectedBase(selectedBase === base ? null : base);
  };

  const handleOutsChange = (_: React.MouseEvent<HTMLElement>, newOuts: number | null) => {
    setSelectedOuts(newOuts);
  };

  const handlePositionChange = (_: React.MouseEvent<HTMLElement>, newPosition: Position | null) => {
    setSelectedPosition(newPosition);
  };

  const handleClearFilters = () => {
    setSelectedBase(null);
    setSelectedOuts(null);
    setSelectedPosition(null);
  };

  const handleStartScenario = (scenario: ScenarioV2) => {
    setActiveScenario(scenario);
    setShowDrill(true);
  };

  const handleCloseDrill = () => {
    setShowDrill(false);
    setActiveScenario(null);
  };

  const handleDrillAnswer = () => {
    // In standalone mode, just close the dialog after viewing the result
    setTimeout(() => {
      setShowDrill(false);
      setActiveScenario(null);
    }, 2000);
  };

  const renderBaseIcon = (runners: ('1b' | '2b' | '3b')[]) => {
    const has1b = runners.includes('1b');
    const has2b = runners.includes('2b');
    const has3b = runners.includes('3b');

    return (
      <Box sx={{ position: 'relative', width: 40, height: 40 }}>
        {/* Diamond shape */}
        <svg width="40" height="40" viewBox="0 0 40 40">
          {/* Diamond outline */}
          <path
            d="M20 4L36 20L20 36L4 20L20 4Z"
            stroke="#1976d2"
            strokeWidth="2"
            fill="none"
            opacity={0.3}
          />
          {/* First base (right) */}
          <circle
            cx="32"
            cy="20"
            r="4"
            fill={has1b ? '#1976d2' : 'transparent'}
            stroke="#1976d2"
            strokeWidth="1.5"
          />
          {/* Second base (top) */}
          <circle
            cx="20"
            cy="8"
            r="4"
            fill={has2b ? '#1976d2' : 'transparent'}
            stroke="#1976d2"
            strokeWidth="1.5"
          />
          {/* Third base (left) */}
          <circle
            cx="8"
            cy="20"
            r="4"
            fill={has3b ? '#1976d2' : 'transparent'}
            stroke="#1976d2"
            strokeWidth="1.5"
          />
          {/* Home plate (bottom) - always empty in this view */}
          <path
            d="M20 32L16 28L16 26L24 26L24 28L20 32Z"
            fill="none"
            stroke="#1976d2"
            strokeWidth="1.5"
            opacity={0.5}
          />
        </svg>
      </Box>
    );
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-start' }}
            spacing={{ xs: 2, md: 0 }}
          >
            <Box>
              <DiamondIQLogo />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Scenario Browser
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                Select a base runner situation, outs, and fielding position to find specific scenarios.
              </Typography>
            </Box>
            <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }} sx={{ width: { xs: '100%', md: 'auto' } }}>
              {/* Action Buttons */}
              <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/drill')}
                  startIcon={<Zap size={18} />}
                  sx={{ flex: { xs: 1, md: 'none' } }}
                >
                  Adaptive Drill
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/progress')}
                  startIcon={<BarChart3 size={18} />}
                  sx={{ flex: { xs: 1, md: 'none' } }}
                >
                  Progress
                </Button>
              </Stack>
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

        {/* Base Runner Configuration Grid */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Base Runner Situation
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {BASE_OPTIONS.map((option) => (
              <Card
                key={option.id}
                sx={{
                  cursor: 'pointer',
                  border: selectedBase === option.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  bgcolor: selectedBase === option.id ? 'primary.50' : 'background.paper',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1976d2',
                    boxShadow: 2,
                  },
                }}
                onClick={() => handleBaseSelect(option.id)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {renderBaseIcon(option.runners)}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {option.label}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${baseCounts[option.id]} scenarios`}
                    sx={{ fontSize: '0.7rem' }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>

        {/* Outs and Position Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            {/* Outs Filter */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Number of Outs
              </Typography>
              <ToggleButtonGroup
                value={selectedOuts}
                exclusive
                onChange={handleOutsChange}
                size="small"
              >
                <ToggleButton value={0} sx={{ px: 3 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Circle size={12} />
                    <Circle size={12} />
                    <Typography variant="body2" sx={{ ml: 1 }}>0 Outs</Typography>
                  </Stack>
                </ToggleButton>
                <ToggleButton value={1} sx={{ px: 3 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CircleDot size={12} />
                    <Circle size={12} />
                    <Typography variant="body2" sx={{ ml: 1 }}>1 Out</Typography>
                  </Stack>
                </ToggleButton>
                <ToggleButton value={2} sx={{ px: 3 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CircleDot size={12} />
                    <CircleDot size={12} />
                    <Typography variant="body2" sx={{ ml: 1 }}>2 Outs</Typography>
                  </Stack>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

            {/* Position Filter */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Ball Hit To (Position)
              </Typography>
              <ToggleButtonGroup
                value={selectedPosition}
                exclusive
                onChange={handlePositionChange}
                size="small"
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                {availablePositions.map((pos) => (
                  <ToggleButton key={pos} value={pos} sx={{ px: 2 }}>
                    {POSITION_LABELS[pos]}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Stack>

          {/* Clear Filters */}
          {(selectedBase || selectedOuts !== null || selectedPosition) && (
            <Box sx={{ mt: 2 }}>
              <Button variant="text" size="small" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </Box>
          )}
        </Paper>

        {/* Filtered Scenarios List */}
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Matching Scenarios
            </Typography>
            <Chip
              label={`${filteredScenarios.length} scenario${filteredScenarios.length !== 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
            />
          </Stack>

          {filteredScenarios.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">
                No scenarios match your current filters. Try adjusting your selection.
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: { xs: 350, sm: 400, md: 500 }, overflow: 'auto' }}>
              {filteredScenarios.map((scenario, index) => (
                <React.Fragment key={scenario.id}>
                  {index > 0 && <Divider />}
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleStartScenario(scenario)}>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {scenario.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={scenario.sport}
                              sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                            />
                            <Chip
                              size="small"
                              label={scenario.difficulty || 'medium'}
                              color={
                                scenario.difficulty === 'easy'
                                  ? 'success'
                                  : scenario.difficulty === 'hard'
                                  ? 'error'
                                  : 'warning'
                              }
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Stack>
                        }
                        secondary={
                          <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="textSecondary">
                              {scenario.outs} out{scenario.outs !== 1 ? 's' : ''}
                            </Typography>
                            {scenario.position && (
                              <Typography variant="caption" color="textSecondary">
                                Position: {POSITION_LABELS[scenario.position]}
                              </Typography>
                            )}
                            <Typography variant="caption" color="textSecondary">
                              Level: {scenario.level}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Play size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartScenario(scenario);
                        }}
                      >
                        Practice
                      </Button>
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Drill Dialog */}
        <Dialog
          open={showDrill}
          onClose={handleCloseDrill}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { maxHeight: '90vh' } }}
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{activeScenario?.title}</Typography>
              <Button onClick={handleCloseDrill} size="small">
                Close
              </Button>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            {activeScenario && (
              <DrillPlayer
                scenario={activeScenario}
                onAnswer={handleDrillAnswer}
                isLoading={false}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDrill}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
