# Diamond IQ

An adaptive training application that helps baseball and softball players improve their situational awareness ("Baseball IQ") through interactive drills.

## Features

### Animated Landing Page
- Modern dark-themed welcome screen with pulsing logo animation
- Smooth Framer Motion entrance animations
- Responsive design for mobile and desktop

### Scenario Browser (Dashboard)
Browse and practice specific game situations with filters for:
- **Base Runner Configurations** - 8 options from bases empty to bases loaded
- **Number of Outs** - 0, 1, or 2 outs
- **Fielding Position** - Filter by where the ball is hit

### Adaptive Drill Mode
Spaced repetition training system that:
- Tracks your progress on each scenario
- Prioritizes scenarios you struggle with
- Uses Leitner algorithm for optimal learning intervals
- Persists session data locally

### 30 Training Scenarios
Comprehensive coverage of game situations including:
- Bases empty plays
- Runner on first, second, or third
- Multiple runner situations (1st & 2nd, 1st & 3rd, 2nd & 3rd)
- Bases loaded situations
- Both baseball and softball scenarios
- Various difficulty levels (easy, medium, hard)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Application Routes

| Route | Description |
|-------|-------------|
| `/welcome` | Animated landing page |
| `/login` | Sign in page |
| `/` | Scenario Browser (dashboard) - requires auth |
| `/drill` | Adaptive Drill mode - requires auth |
| `/preview` | Scenario preview tool (admin) |

## Tech Stack

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Fast build tool
- **Material UI (MUI)** - Component library with Material Design 3
- **Framer Motion** - Smooth animations
- **Zod** - Schema validation
- **React Router** - Client-side routing
- **pnpm** - Package manager

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── DiamondIQLogo.tsx    # Animated logo component
│   ├── DrillPlayer.tsx      # Scenario drill UI
│   ├── FilterPanel.tsx      # Filter controls
│   └── ProtectedRoute.tsx   # Auth guard
├── contexts/            # React contexts
│   └── AuthContext.tsx      # Authentication state
├── data/                # Static data
│   └── starterDataset.ts    # 30 training scenarios

├── pages/               # Page components
│   ├── LandingPage.tsx      # Welcome screen
│   ├── LoginPage.tsx        # Authentication
│   ├── ScenarioSelectPage.tsx  # Scenario browser
│   ├── AdaptiveDrillPage.tsx   # Spaced repetition drills
│   └── ScenarioPreviewPage.tsx # Admin preview
├── types/               # TypeScript definitions
│   ├── scenario.ts          # Scenario schemas (Zod)
│   ├── drillSession.ts      # Session tracking
│   └── scenarioFilter.ts    # Filter types
├── utils/               # Utility functions
│   ├── drillEngine.ts       # Spaced repetition logic
│   ├── filterScenarios.ts   # Scenario filtering
│   └── sessionPersistence.ts # LocalStorage helpers
├── App.tsx              # Root component with routing
└── main.tsx             # Entry point
```

## Scenario Structure

Each scenario includes:
- **Situation**: Base runners, outs, game context
- **Question**: Decision the player must make
- **Three Answers**: Best, OK, and Bad options
- **Coaching Cues**: Teaching moments for each answer
- **Animations**: Visual representation of plays

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint checks |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm format` | Format with Prettier |
| `pnpm type-check` | TypeScript checking |

## Development

### Prerequisites
- Node.js 18+
- pnpm

### IDE Setup (VS Code)
Recommended extensions:
- ESLint
- Prettier

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## License

MIT
