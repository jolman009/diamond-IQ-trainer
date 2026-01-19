import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { Upload, Cloud, Trash2 } from 'lucide-react';
import {
  MigrationStats,
  getLocalStorageStats,
  migrateToSupabase,
  skipMigration,
} from '@/services/migrationService';

interface MigrationPromptProps {
  open: boolean;
  userId: string;
  onComplete: () => void;
}

type MigrationChoice = 'merge' | 'replace' | 'skip';

export const MigrationPrompt: React.FC<MigrationPromptProps> = ({
  open,
  userId,
  onComplete,
}) => {
  const [choice, setChoice] = useState<MigrationChoice>('merge');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats: MigrationStats | null = getLocalStorageStats();

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (choice === 'skip') {
        skipMigration(userId);
        onComplete();
        return;
      }

      const result = await migrateToSupabase(userId, choice);

      if (result.success) {
        onComplete();
      } else {
        setError(result.error || 'Migration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!stats) return null;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Upload size={24} />
          <span>Import Your Progress</span>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          We found existing progress data on this device. Would you like to import it to your account?
        </Typography>

        {/* Stats Display */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'primary.50',
            borderRadius: 2,
            border: 1,
            borderColor: 'primary.200',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Local Progress Found:
          </Typography>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.totalAttempts}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Total Attempts
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.scenarioCount}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Scenarios Practiced
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.bestStreak}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Best Streak
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Migration Options */}
        <FormControl component="fieldset">
          <RadioGroup
            value={choice}
            onChange={(e) => setChoice(e.target.value as MigrationChoice)}
          >
            <FormControlLabel
              value="merge"
              control={<Radio />}
              label={
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Cloud size={18} />
                    <Typography sx={{ fontWeight: 500 }}>
                      Merge with cloud data
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="textSecondary">
                    Combines local and cloud progress, keeping the best results
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="replace"
              control={<Radio />}
              label={
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Upload size={18} />
                    <Typography sx={{ fontWeight: 500 }}>
                      Replace cloud data
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="textSecondary">
                    Overwrites any cloud progress with local data
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="skip"
              control={<Radio />}
              label={
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Trash2 size={18} />
                    <Typography sx={{ fontWeight: 500 }}>
                      Skip and discard local data
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="textSecondary">
                    Use only cloud data, local progress will be lost
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleConfirm} variant="contained" disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processing...
            </>
          ) : choice === 'skip' ? (
            'Skip Import'
          ) : (
            'Import Progress'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
