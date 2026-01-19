import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DiamondIQLogo } from '@/components/DiamondIQLogo';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

type AuthMode = 'login' | 'signup';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, error, clearError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleModeChange = (_: React.SyntheticEvent, newMode: AuthMode) => {
    setMode(newMode);
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setLocalError('Passwords do not match');
          return;
        }
        await signup({ email, password, displayName: displayName || undefined });
        // If we get here without throwing, user is logged in (no email confirmation)
        navigate('/');
      } else {
        await login({ email, password });
        navigate('/');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      // Check if it's an email confirmation message
      if (message.includes('confirmation')) {
        setSuccessMessage(message);
      } else {
        setLocalError(message);
      }
    }
  };

  const displayError = localError || error;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        bgcolor: '#0f1419',
        backgroundImage: 'radial-gradient(#1a2634 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3, bgcolor: '#1a2634', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Stack spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
              <DiamondIQLogo />
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                {mode === 'login' ? 'Sign in to continue training' : 'Create your account'}
              </Typography>
            </Stack>

            {/* Auth Mode Tabs */}
            <Tabs
              value={mode}
              onChange={handleModeChange}
              centered
              sx={{
                mb: 3,
                '& .MuiTab-root': { color: 'grey.400' },
                '& .Mui-selected': { color: 'primary.main' },
              }}
            >
              <Tab label="Sign In" value="login" />
              <Tab label="Sign Up" value="signup" />
            </Tabs>

            {/* Success Message */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            {/* Error Alert */}
            {displayError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {displayError}
              </Alert>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {/* Display Name (Signup only) */}
                {mode === 'signup' && (
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading}
                    placeholder="Your name"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'grey.700' },
                        '&:hover fieldset': { borderColor: 'grey.500' },
                      },
                      '& .MuiInputLabel-root': { color: 'grey.400' },
                      '& .MuiInputBase-input': { color: 'white' },
                    }}
                  />
                )}

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  autoFocus
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'grey.700' },
                      '&:hover fieldset': { borderColor: 'grey.500' },
                    },
                    '& .MuiInputLabel-root': { color: 'grey.400' },
                    '& .MuiInputBase-input': { color: 'white' },
                  }}
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  required
                  helperText={mode === 'signup' ? 'Minimum 6 characters' : undefined}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'grey.700' },
                      '&:hover fieldset': { borderColor: 'grey.500' },
                    },
                    '& .MuiInputLabel-root': { color: 'grey.400' },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'grey.500' },
                  }}
                />

                {/* Confirm Password (Signup only) */}
                {mode === 'signup' && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'grey.700' },
                        '&:hover fieldset': { borderColor: 'grey.500' },
                      },
                      '& .MuiInputLabel-root': { color: 'grey.400' },
                      '& .MuiInputBase-input': { color: 'white' },
                    }}
                  />
                )}

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={isLoading}
                  sx={{ mt: 2 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : mode === 'login' ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Stack>
            </form>

            {/* Mode-specific info */}
            {!isSupabaseConfigured && (
              <>
                <Divider sx={{ my: 3, borderColor: 'grey.700' }} />
                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.400' }}>
                    <strong>Demo Mode:</strong> Supabase is not configured. Use any email and password to sign in. Your session is stored locally.
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
