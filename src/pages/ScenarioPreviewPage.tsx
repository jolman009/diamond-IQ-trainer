import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Check, X, Search, RotateCcw, Eye } from 'lucide-react';
import { STARTER_DATASET } from '@/data/starterDataset';
import { ScenarioV2, AnswerOption, Position, AnswerAnimation } from '@/types/scenario';
import { BaseballField } from '@/components/BaseballField';

type AnswerType = 'best' | 'ok' | 'bad';

// Local storage key for tracking verified scenarios
const VERIFIED_KEY = 'scenario-preview-verified';

const loadVerified = (): Set<string> => {
  try {
    const stored = localStorage.getItem(VERIFIED_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveVerified = (verified: Set<string>) => {
  localStorage.setItem(VERIFIED_KEY, JSON.stringify([...verified]));
};

export const ScenarioPreviewPage: React.FC = () => {
  const scenarios = STARTER_DATASET.scenarios;
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    scenarios[0]?.id || null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerType>('best');
  const [isAnimating, setIsAnimating] = useState(false);
  const [verified, setVerified] = useState<Set<string>>(loadVerified);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedScenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) || null,
    [scenarios, selectedScenarioId]
  );

  const filteredScenarios = useMemo(() => {
    if (!searchQuery.trim()) return scenarios;
    const query = searchQuery.toLowerCase();
    return scenarios.filter(
      (s) =>
        s.id.toLowerCase().includes(query) ||
        s.title.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.sport.toLowerCase().includes(query)
    );
  }, [scenarios, searchQuery]);

  const stats = useMemo(() => {
    const total = scenarios.length;
    const verifiedCount = scenarios.filter((s) => verified.has(s.id)).length;
    const withAnimations = scenarios.filter(
      (s) => s.best.animation && s.ok.animation && s.bad.animation
    ).length;
    return { total, verifiedCount, withAnimations };
  }, [scenarios, verified]);

  const getAnswerOption = (scenario: ScenarioV2, type: AnswerType): AnswerOption => {
    return scenario[type];
  };

  const handlePlayAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  };

  const handleVerify = (scenarioId: string) => {
    const newVerified = new Set(verified);
    if (newVerified.has(scenarioId)) {
      newVerified.delete(scenarioId);
    } else {
      newVerified.add(scenarioId);
    }
    setVerified(newVerified);
    saveVerified(newVerified);
  };

  const handleClearVerified = () => {
    setVerified(new Set());
    saveVerified(new Set());
  };

  const currentAnswer = selectedScenario ? getAnswerOption(selectedScenario, selectedAnswer) : null;

  // Get animation for display
  const getAnimationConfig = (): AnswerAnimation | undefined => {
    return currentAnswer?.animation;
  };

  // Infer ball location from animation
  const inferBallLocation = (): Position | undefined => {
    const anim = getAnimationConfig();
    if (anim?.ballStart) {
      const positions: Position[] = ['c', '1b', '2b', '3b', 'ss', 'lf', 'cf', 'rf', 'p'];
      if (positions.includes(anim.ballStart as Position)) {
        return anim.ballStart as Position;
      }
    }
    return selectedScenario?.position;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Scenario Animation Preview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Review and verify animations for all scenarios. Click on a scenario to preview its
          animations.
        </Typography>

        {/* Stats */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            label={`${stats.verifiedCount}/${stats.total} Verified`}
            color={stats.verifiedCount === stats.total ? 'success' : 'default'}
          />
          <Chip
            label={`${stats.withAnimations}/${stats.total} Have All Animations`}
            color={stats.withAnimations === stats.total ? 'success' : 'warning'}
          />
          <Button size="small" onClick={handleClearVerified} disabled={verified.size === 0}>
            Clear All Verified
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Scenario List */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ height: { xs: 'calc(100vh - 200px)', md: 'calc(100vh - 250px)' }, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <List sx={{ overflow: 'auto', flex: 1 }}>
              {filteredScenarios.map((scenario) => {
                const isVerified = verified.has(scenario.id);
                const hasAllAnims = !!(
                  scenario.best.animation &&
                  scenario.ok.animation &&
                  scenario.bad.animation
                );
                return (
                  <ListItem
                    key={scenario.id}
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerify(scenario.id);
                        }}
                        color={isVerified ? 'success' : 'default'}
                      >
                        {isVerified ? <Check size={18} /> : <X size={18} />}
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={selectedScenarioId === scenario.id}
                      onClick={() => {
                        setSelectedScenarioId(scenario.id);
                        setSelectedAnswer('best');
                        setIsAnimating(false);
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {hasAllAnims ? (
                          <Eye size={16} color="green" />
                        ) : (
                          <Eye size={16} color="orange" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={scenario.id}
                        secondary={scenario.title}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Preview Panel */}
        <Grid item xs={12} md={8} lg={9}>
          {selectedScenario ? (
            <Grid container spacing={3}>
              {/* Field Visualization */}
              <Grid item xs={12} lg={7}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Field Preview
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: '#f0f4f8',
                      borderRadius: 2,
                      p: { xs: 1, md: 2 },
                      aspectRatio: '1/1',
                      maxHeight: { xs: 300, sm: 400, md: 500 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BaseballField
                      sport={selectedScenario.sport}
                      runners={selectedScenario.runners}
                      highlightPosition={selectedScenario.position}
                      animate={isAnimating}
                      ballLocation={inferBallLocation()}
                      animationConfig={getAnimationConfig()}
                    />
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<RotateCcw size={18} />}
                      onClick={handlePlayAnimation}
                      disabled={!currentAnswer?.animation}
                    >
                      Play Animation
                    </Button>
                    <Button
                      variant="outlined"
                      color={verified.has(selectedScenario.id) ? 'success' : 'primary'}
                      startIcon={verified.has(selectedScenario.id) ? <Check size={18} /> : null}
                      onClick={() => handleVerify(selectedScenario.id)}
                    >
                      {verified.has(selectedScenario.id) ? 'Verified' : 'Mark as Verified'}
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              {/* Scenario Details */}
              <Grid item xs={12} lg={5}>
                <Stack spacing={2}>
                  {/* Scenario Info */}
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {selectedScenario.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                      <Chip label={selectedScenario.sport} size="small" />
                      <Chip label={selectedScenario.level} size="small" />
                      <Chip label={selectedScenario.category} size="small" variant="outlined" />
                      {selectedScenario.position && (
                        <Chip
                          label={`Position: ${selectedScenario.position.toUpperCase()}`}
                          size="small"
                          color="primary"
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {selectedScenario.description}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`Outs: ${selectedScenario.outs}`} size="small" />
                      {selectedScenario.runners.length > 0 && (
                        <Chip
                          label={`Runners: ${selectedScenario.runners.join(', ')}`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      {selectedScenario.question}
                    </Typography>
                  </Paper>

                  {/* Answer Options */}
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Select Answer to Preview
                    </Typography>
                    <Stack spacing={1}>
                      {(['best', 'ok', 'bad'] as AnswerType[]).map((type) => {
                        const answer = getAnswerOption(selectedScenario, type);
                        const hasAnim = !!answer.animation;
                        const colors: Record<AnswerType, 'success' | 'warning' | 'error'> = {
                          best: 'success',
                          ok: 'warning',
                          bad: 'error',
                        };
                        return (
                          <Card
                            key={type}
                            variant="outlined"
                            sx={{
                              borderColor:
                                selectedAnswer === type ? `${colors[type]}.main` : 'divider',
                              bgcolor: selectedAnswer === type ? `${colors[type]}.lighter` : 'transparent',
                            }}
                          >
                            <CardActionArea
                              onClick={() => {
                                setSelectedAnswer(type);
                                setIsAnimating(false);
                              }}
                            >
                              <CardContent sx={{ py: 1.5 }}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color={`${colors[type]}.main`}
                                      fontWeight="bold"
                                    >
                                      {type.toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2">{answer.label}</Typography>
                                  </Box>
                                  <Chip
                                    label={hasAnim ? 'Has Animation' : 'No Animation'}
                                    size="small"
                                    color={hasAnim ? 'success' : 'error'}
                                    variant="outlined"
                                  />
                                </Stack>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        );
                      })}
                    </Stack>
                  </Paper>

                  {/* Animation Details */}
                  {currentAnswer && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Animation Details
                      </Typography>
                      {currentAnswer.animation ? (
                        <Box sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                          <Typography variant="body2">
                            <strong>Ball:</strong> {currentAnswer.animation.ballStart} →{' '}
                            {currentAnswer.animation.ballEnd}
                          </Typography>
                          {currentAnswer.animation.playerMovements &&
                            currentAnswer.animation.playerMovements.length > 0 && (
                              <Typography variant="body2">
                                <strong>Player Movements:</strong>
                                {currentAnswer.animation.playerMovements.map((m, i) => (
                                  <span key={i}>
                                    {' '}
                                    {m.position.toUpperCase()} → {m.target}
                                    {i < currentAnswer.animation!.playerMovements!.length - 1
                                      ? ','
                                      : ''}
                                  </span>
                                ))}
                              </Typography>
                            )}
                        </Box>
                      ) : (
                        <Alert severity="warning" sx={{ py: 0.5 }}>
                          No animation defined for this answer
                        </Alert>
                      )}
                    </Paper>
                  )}
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Select a scenario to preview</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
