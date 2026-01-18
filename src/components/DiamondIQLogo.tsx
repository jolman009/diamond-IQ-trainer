import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

interface DiamondIQLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const DiamondIQLogo: React.FC<DiamondIQLogoProps> = ({
  size = 'medium',
  showText = true,
}) => {
  const dimensions = {
    small: { svg: 32, text: 'h6' as const },
    medium: { svg: 48, text: 'h4' as const },
    large: { svg: 64, text: 'h3' as const },
  };

  const { svg: svgSize, text: textVariant } = dimensions[size];

  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box sx={{ display: 'flex' }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Diamond IQ Logo"
        >
          <defs>
            {/* Primary gradient for outer diamond */}
            <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42a5f5" />
              <stop offset="50%" stopColor="#1976d2" />
              <stop offset="100%" stopColor="#0d47a1" />
            </linearGradient>

            {/* Shimmer gradient for animation overlay */}
            <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)">
                <animate
                  attributeName="offset"
                  values="-0.5;1.5"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="25%" stopColor="rgba(255,255,255,0.3)">
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

            {/* Inner glow filter */}
            <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Clip path for shimmer effect */}
            <clipPath id="diamondClip">
              <path d="M32 6L58 32L32 58L6 32L32 6Z" />
            </clipPath>
          </defs>

          <style>
            {`
              @keyframes nodeGlow {
                0%, 100% {
                  opacity: 0.6;
                  transform: scale(1);
                }
                50% {
                  opacity: 1;
                  transform: scale(1.15);
                }
              }
              @keyframes centerPulse {
                0%, 100% {
                  opacity: 0.8;
                  r: 4;
                }
                50% {
                  opacity: 1;
                  r: 5;
                }
              }
              @keyframes pathDraw {
                0%, 100% { stroke-dashoffset: 0; }
                50% { stroke-dashoffset: 4; }
              }
              .node {
                animation: nodeGlow 2.5s ease-in-out infinite;
                transform-origin: center;
              }
              .node-1 { animation-delay: 0s; }
              .node-2 { animation-delay: 0.3s; }
              .node-3 { animation-delay: 0.6s; }
              .node-4 { animation-delay: 0.9s; }
              .center-node {
                animation: centerPulse 2s ease-in-out infinite;
              }
              .inner-paths {
                animation: pathDraw 4s ease-in-out infinite;
                stroke-dasharray: 8 4;
              }
            `}
          </style>

          {/* Outer diamond - main shape with gradient fill */}
          <path
            d="M32 6L58 32L32 58L6 32L32 6Z"
            fill="url(#diamondGradient)"
            opacity="0.15"
          />

          {/* Outer diamond stroke */}
          <path
            d="M32 6L58 32L32 58L6 32L32 6Z"
            stroke="url(#diamondGradient)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Shimmer overlay */}
          <rect
            x="0"
            y="0"
            width="64"
            height="64"
            fill="url(#shimmerGradient)"
            clipPath="url(#diamondClip)"
          />

          {/* Inner diamond - smaller rotated square suggesting depth */}
          <path
            d="M32 16L48 32L32 48L16 32L32 16Z"
            stroke="#1976d2"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
            opacity="0.5"
          />

          {/* Connecting lines from center to corners - baselines */}
          <g className="inner-paths" stroke="#1976d2" strokeWidth="1" opacity="0.4">
            <line x1="32" y1="32" x2="32" y2="52" />
            <line x1="32" y1="32" x2="52" y2="32" />
            <line x1="32" y1="32" x2="32" y2="12" />
            <line x1="32" y1="32" x2="12" y2="32" />
          </g>

          {/* Base nodes - abstract representation of bases */}
          <g filter="url(#innerGlow)">
            {/* Home plate - bottom */}
            <circle
              className="node node-1"
              cx="32"
              cy="52"
              r="3"
              fill="#1976d2"
            />
            {/* First base - right */}
            <circle
              className="node node-2"
              cx="52"
              cy="32"
              r="3"
              fill="#1976d2"
            />
            {/* Second base - top */}
            <circle
              className="node node-3"
              cx="32"
              cy="12"
              r="3"
              fill="#1976d2"
            />
            {/* Third base - left */}
            <circle
              className="node node-4"
              cx="12"
              cy="32"
              r="3"
              fill="#1976d2"
            />
          </g>

          {/* Center node - represents the "IQ" / intelligence aspect */}
          <circle
            className="center-node"
            cx="32"
            cy="32"
            r="4"
            fill="#1976d2"
          >
            <animate
              attributeName="r"
              values="4;5;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner ring around center - tech/precision feel */}
          <circle
            cx="32"
            cy="32"
            r="8"
            stroke="#1976d2"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="8;9;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.5;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </Box>

      {showText && (
        <Typography
          variant={textVariant}
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          Diamond IQ
        </Typography>
      )}
    </Stack>
  );
};
