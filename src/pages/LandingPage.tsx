import React, { useState } from 'react';
import { Box, Button, Stack, Typography, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

/**
 * LandingPage
 *
 * Animated landing page with Framer Motion:
 * - Full-screen dark background
 * - Large centered logo with pulse animation
 * - Ghost/outlined buttons that fade in after logo
 */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleCreateAccount = () => {
    setShowComingSoon(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(25, 118, 210, 0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient glow behind logo - responsive sizing */}
      <Box
        component={motion.div}
        sx={{
          position: 'absolute',
          width: { xs: '250px', sm: '320px', md: '400px' },
          height: { xs: '250px', sm: '320px', md: '400px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25, 118, 210, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Logo Container - Fades in first */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1], // custom easeOutExpo
        }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <LandingLogo />
      </motion.div>

      {/* App Name - Fades in after logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.6,
          ease: 'easeOut',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            mt: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 50%, #0d47a1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Diamond IQ
        </Typography>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.9,
          ease: 'easeOut',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            mt: 1,
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            letterSpacing: '0.05em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Train Your Baseball IQ
        </Typography>
      </motion.div>

      {/* Buttons - Fade in last with stagger */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{
          mt: 6,
          position: 'relative',
          zIndex: 1,
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '300px', sm: 'none' },
          px: { xs: 4, sm: 0 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 1.4,
            ease: 'easeOut',
          }}
          style={{ width: '100%' }}
        >
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleSignIn}
            startIcon={<LogIn size={20} />}
            sx={{
              px: 4,
              py: 1.5,
              borderColor: 'rgba(25, 118, 210, 0.6)',
              color: '#42a5f5',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.25)',
              },
            }}
          >
            Sign In
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 1.6,
            ease: 'easeOut',
          }}
          style={{ width: '100%' }}
        >
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleCreateAccount}
            startIcon={<UserPlus size={20} />}
            sx={{
              px: 4,
              py: 1.5,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Create Account
          </Button>
        </motion.div>
      </Stack>

      {/* Coming Soon Snackbar */}
      <Snackbar
        open={showComingSoon}
        autoHideDuration={3000}
        onClose={() => setShowComingSoon(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          onClose={() => setShowComingSoon(false)}
          sx={{ bgcolor: '#1976d2', color: 'white' }}
        >
          Account creation coming soon!
        </Alert>
      </Snackbar>
    </Box>
  );
};

/**
 * Large animated logo for landing page with Framer Motion
 * Responsive sizing: 120px on mobile, 150px on tablet, 180px on desktop
 */
const LandingLogo: React.FC = () => {
  return (
    <Box
      component={motion.div}
      sx={{
        width: { xs: 120, sm: 150, md: 180 },
        height: { xs: 120, sm: 150, md: 180 },
      }}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Diamond IQ Logo"
      >
      <defs>
        {/* Primary gradient for outer diamond */}
        <linearGradient id="landingDiamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="50%" stopColor="#1976d2" />
          <stop offset="100%" stopColor="#0d47a1" />
        </linearGradient>

        {/* Shimmer gradient for animation overlay */}
        <linearGradient id="landingShimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)">
            <animate
              attributeName="offset"
              values="-0.5;1.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="25%" stopColor="rgba(255,255,255,0.4)">
            <animate
              attributeName="offset"
              values="-0.25;1.75"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="rgba(255,255,255,0)">
            <animate
              attributeName="offset"
              values="0;2"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        {/* Glow filter */}
        <filter id="landingGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Clip path for shimmer effect */}
        <clipPath id="landingDiamondClip">
          <path d="M32 6L58 32L32 58L6 32L32 6Z" />
        </clipPath>
      </defs>

      {/* Outer diamond - main shape with gradient fill */}
      <motion.path
        d="M32 6L58 32L32 58L6 32L32 6Z"
        fill="url(#landingDiamondGradient)"
        opacity="0.2"
      />

      {/* Outer diamond stroke with pulse */}
      <motion.path
        d="M32 6L58 32L32 58L6 32L32 6Z"
        stroke="url(#landingDiamondGradient)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
        animate={{
          strokeWidth: [2.5, 3.5, 2.5],
          opacity: [1, 0.85, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Shimmer overlay */}
      <rect
        x="0"
        y="0"
        width="64"
        height="64"
        fill="url(#landingShimmerGradient)"
        clipPath="url(#landingDiamondClip)"
      />

      {/* Inner diamond */}
      <path
        d="M32 16L48 32L32 48L16 32L32 16Z"
        stroke="#1976d2"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
      />

      {/* Connecting lines */}
      <g stroke="#1976d2" strokeWidth="1" opacity="0.3">
        <line x1="32" y1="32" x2="32" y2="52" />
        <line x1="32" y1="32" x2="52" y2="32" />
        <line x1="32" y1="32" x2="32" y2="12" />
        <line x1="32" y1="32" x2="12" y2="32" />
      </g>

      {/* Base nodes with staggered pulse */}
      <g filter="url(#landingGlow)">
        {/* Home plate - bottom */}
        <motion.circle
          cx="32"
          cy="52"
          r="3.5"
          fill="#42a5f5"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0,
          }}
        />
        {/* First base - right */}
        <motion.circle
          cx="52"
          cy="32"
          r="3.5"
          fill="#42a5f5"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.25,
          }}
        />
        {/* Second base - top */}
        <motion.circle
          cx="32"
          cy="12"
          r="3.5"
          fill="#42a5f5"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        {/* Third base - left */}
        <motion.circle
          cx="12"
          cy="32"
          r="3.5"
          fill="#42a5f5"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.75,
          }}
        />
      </g>

      {/* Center node with pulse */}
      <motion.circle
        cx="32"
        cy="32"
        r="5"
        fill="#1976d2"
        animate={{
          r: [5, 6.5, 5],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner ring pulse */}
      <motion.circle
        cx="32"
        cy="32"
        r="8"
        stroke="#42a5f5"
        strokeWidth="1"
        fill="none"
        animate={{
          r: [8, 11, 8],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outer ring pulse */}
      <motion.circle
        cx="32"
        cy="32"
        r="14"
        stroke="#1976d2"
        strokeWidth="0.5"
        fill="none"
        animate={{
          r: [14, 18, 14],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      </motion.svg>
    </Box>
  );
};
