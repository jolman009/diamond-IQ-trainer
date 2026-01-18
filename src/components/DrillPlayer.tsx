import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  LinearProgress,
  Chip,
  Grid,
  Paper,
  Alert,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { RotateCcw, Play, Pause, Flame } from 'lucide-react';
import { ScenarioV2, Position, AnswerAnimation } from '@/types/scenario';
import { AnswerQuality } from '@/types/drillSession';
import { BaseballField } from './BaseballField';
import { playAnswerSound } from '@/utils/sounds';

interface DrillPlayerProps {
  scenario: ScenarioV2;
  onAnswer: (quality: AnswerQuality) => void;
  isLoading?: boolean;
  currentStreak?: number;
}

/**
 * DrillPlayer Component
 *
 * Core rep loop UI that displays:
 * 1. Scenario question with context (runners, outs, level)
 * 2. Timer with pressure element (countdown optional)
 * 3. Three answer buttons (BEST, OK, BAD)
 * 4. Reveal phase showing correct answer + coaching cue
 * 5. Auto-advances to next scenario on answer
 *
 * States:
 * - ANSWERING: User can click BEST/OK/BAD buttons
 * - REVEALING: Shows selected answer + correct answer + coaching cue
 * - NEXT: Can proceed to next scenario
 */
export const DrillPlayer: React.FC<DrillPlayerProps> = ({
  scenario,
  onAnswer,
  isLoading = false,
  currentStreak = 0,
}) => {
  const [phase, setPhase] = useState<'answering' | 'revealing'>('answering');
  const [selectedQuality, setSelectedQuality] = useState<AnswerQuality | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const maxTime = 30; // seconds for pressure element

  // Timer logic - disabled in practice mode
  useEffect(() => {
    if (phase !== 'answering' || isPaused || practiceMode) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev >= maxTime) {
          handleTimeout();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused, practiceMode]);

  // Reset state when scenario changes
  useEffect(() => {
    setPhase('answering');
    setSelectedQuality(null);
    setTimeElapsed(0);
    setIsAnimating(false);
    setIsPaused(false);
  }, [scenario.id]);

  // Handler functions
  const handleAnswerClick = (quality: AnswerQuality) => {
    setSelectedQuality(quality);
    setPhase('revealing');
    setIsAnimating(true);
    playAnswerSound(quality);
  };

  const handleTimeout = () => {
    setSelectedQuality('timeout');
    setPhase('revealing');
    setIsAnimating(true);
    playAnswerSound('timeout');
  };

  const handleNextScenario = useCallback(() => {
    if (!selectedQuality) return;
    onAnswer(selectedQuality);
  }, [selectedQuality, onAnswer]);

  const handleReplay = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Answering phase shortcuts
      if (phase === 'answering' && !isPaused && !isLoading) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            handleAnswerClick('best');
            break;
          case '2':
            event.preventDefault();
            handleAnswerClick('ok');
            break;
          case '3':
            event.preventDefault();
            handleAnswerClick('bad');
            break;
          case ' ': // Spacebar to pause/unpause
            event.preventDefault();
            setIsPaused((prev) => !prev);
            break;
        }
      }

      // Revealing phase shortcuts
      if (phase === 'revealing' && !isLoading) {
        switch (event.key) {
          case ' ': // Spacebar
          case 'Enter':
            event.preventDefault();
            handleNextScenario();
            break;
          case 'r': // Replay animation
          case 'R':
            event.preventDefault();
            handleReplay();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isPaused, isLoading, handleNextScenario, handleReplay]);

  // Get answer option based on quality
  const getAnswerOption = (quality: AnswerQuality) => {
    switch (quality) {
      case 'best':
        return scenario.best;
      case 'ok':
        return scenario.ok;
      case 'bad':
        return scenario.bad;
      case 'timeout':
        return null; // No answer selected on timeout
    }
  };

  const selectedAnswer = selectedQuality ? getAnswerOption(selectedQuality) : null;
  const timeProgress = (timeElapsed / maxTime) * 100;

  // Get animation config from the selected answer's animation data
  const getAnimationConfig = (): AnswerAnimation | undefined => {
    if (!selectedAnswer) return undefined;
    return selectedAnswer.animation;
  };

  // Infer ball location from animation config or scenario position
  const inferBallLocation = (): Position | undefined => {
    // If we have an animation, use its ballStart as the location
    const anim = getAnimationConfig();
    if (anim?.ballStart) {
      // If ballStart is a position (not a base), return it
      const positions: Position[] = ['c', '1b', '2b', '3b', 'ss', 'lf', 'cf', 'rf', 'p'];
      if (positions.includes(anim.ballStart as Position)) {
        return anim.ballStart as Position;
      }
    }
    // Fallback to scenario position
    return scenario.position;
  };

  return (
    <Box sx={{ py: { xs: 1, md: 2 } }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Left/Top Panel: Emphasized Field Visualization */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 4 },
              bgcolor: '#f0f4f8', // Light grey-blue background for contrast
              borderRadius: { xs: 2, md: 3 },
              minHeight: { xs: 250, sm: 300, md: 500 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: { xs: '85%', sm: '90%', md: '100%' }, aspectRatio: '1/1' }}>
              <BaseballField
                sport={scenario.sport}
                runners={scenario.runners}
                highlightPosition={scenario.position}
                animate={isAnimating}
                ballLocation={inferBallLocation()}
                animationConfig={getAnimationConfig()}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right/Bottom Panel: Scenario Controls */}
        <Grid item xs={12} md={5} lg={4}>
          <Stack spacing={{ xs: 2, md: 3 }} sx={{ height: '100%' }}>
            {/* Scenario Info */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={scenario.level.toUpperCase()} size="small" color="primary" variant="outlined" />
                    {currentStreak > 0 && (
                      <Chip
                        icon={<Flame size={14} color="#ff6b35" />}
                        label={currentStreak}
                        size="small"
                        sx={{
                          bgcolor: 'warning.lighter',
                          borderColor: 'warning.main',
                          fontWeight: 700,
                          '& .MuiChip-icon': { ml: 0.5 },
                        }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    {scenario.category.replace(/-/g, ' ').toUpperCase()}
                  </Typography>
                </Stack>

                <Typography
                  variant="h5"
                  fontWeight="800"
                  gutterBottom
                  sx={{ lineHeight: 1.2, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
                >
                  {scenario.title}
                </Typography>

                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  <Chip label={`Outs: ${scenario.outs}`} size="small" />
                  {scenario.runners.length > 0 && (
                    <Chip label={`Runners: ${scenario.runners.join(', ')}`} size="small" color="error" variant="outlined" />
                  )}
                  {scenario.position && (
                    <Chip label={`You: ${scenario.position.toUpperCase()}`} size="small" color="secondary" />
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Description & Question */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: { xs: '0.9rem', md: '1.05rem' }, color: 'text.primary', mb: { xs: 1, md: 2 } }}
              >
                {scenario.description}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, md: 2.5 },
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="600"
                  sx={{ lineHeight: 1.3, fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}
                >
                  {scenario.question}
                </Typography>
              </Paper>
            </Box>

            {/* Practice Mode Toggle & Timer */}
            {phase === 'answering' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={practiceMode}
                        onChange={(e) => setPracticeMode(e.target.checked)}
                        size="small"
                        color="secondary"
                      />
                    }
                    label={
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                        Practice Mode
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                  {!practiceMode && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <IconButton size="small" onClick={() => setIsPaused(!isPaused)} sx={{ p: 0.5 }}>
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                      </IconButton>
                      <Typography variant="caption" color={timeProgress > 80 ? 'error' : 'textSecondary'}>
                        {timeElapsed}s / {maxTime}s
                      </Typography>
                    </Stack>
                  )}
                </Box>
                {!practiceMode && (
                  <LinearProgress
                    variant="determinate"
                    value={timeProgress}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': { bgcolor: timeProgress > 80 ? 'error.main' : 'primary.main' },
                    }}
                  />
                )}
                {practiceMode && (
                  <Typography variant="caption" color="secondary" sx={{ fontStyle: 'italic' }}>
                    Timer disabled - take your time!
                  </Typography>
                )}
              </Box>
            )}

            {/* Answer Phase */}
            {phase === 'answering' && (
              <Stack spacing={{ xs: 1.5, md: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  onClick={() => handleAnswerClick('best')}
                  disabled={isLoading || isPaused}
                  sx={{ py: { xs: 1.25, md: 1.5 }, fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  {scenario.best.label}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  fullWidth
                  onClick={() => handleAnswerClick('ok')}
                  disabled={isLoading || isPaused}
                  sx={{ py: { xs: 1.25, md: 1.5 }, fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  {scenario.ok.label}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  fullWidth
                  onClick={() => handleAnswerClick('bad')}
                  disabled={isLoading || isPaused}
                  sx={{ py: { xs: 1.25, md: 1.5 }, fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  {scenario.bad.label}
                </Button>
              </Stack>
            )}

            {/* Reveal Phase */}
            {phase === 'revealing' && (
              <Stack spacing={{ xs: 1.5, md: 2 }}>
                {/* User's Answer Display */}
                {selectedAnswer && (
                  <Card variant="outlined" sx={{ bgcolor: 'info.lighter', borderColor: 'info.main' }}>
                    <CardContent sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1, md: 1.5 } } }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        YOU SELECTED
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        {selectedAnswer.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        {selectedAnswer.description}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {selectedQuality === 'timeout' && (
                  <Alert severity="error" sx={{ py: { xs: 0.5, md: 1 } }}>
                    Time's Up! You didn't answer in time.
                  </Alert>
                )}

                {/* Correct Answer Display */}
                <Card variant="outlined" sx={{ bgcolor: 'success.lighter', borderColor: 'success.main' }}>
                  <CardContent sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1, md: 1.5 } } }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      BEST PLAY
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.main', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                      {scenario.best.label}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                      {scenario.best.description}
                    </Typography>

                    <Box sx={{ bgcolor: 'success.main', color: 'success.contrastText', p: { xs: 0.75, md: 1 }, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        COACHING CUE:
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        {scenario.best.coaching_cue}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Replay Animation Button */}
                <Button
                  variant="outlined"
                  startIcon={<RotateCcw size={16} />}
                  onClick={handleReplay}
                  fullWidth
                  sx={{ py: { xs: 0.75, md: 1 }, fontSize: { xs: '0.85rem', md: '0.9rem' } }}
                >
                  Replay Action
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleNextScenario}
                  disabled={isLoading}
                  sx={{ py: { xs: 1.25, md: 1.5 }, fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  Next Scenario
                </Button>
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
