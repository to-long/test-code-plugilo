# Frontend Application Documentation (AGENTS.md)

## Overview
This is a modern React 19 frontend application built with TypeScript, Tailwind CSS, and Rsbuild. It serves as a landing page for the Plugilo project.

## Tech Stack

### Core Dependencies
- **React**: v19.0.0 - UI library with latest features
- **React DOM**: v19.0.0 - DOM rendering for React
- **TypeScript**: v5.7.2 - Type-safe JavaScript

### Build Tools
- **Rsbuild**: v1.1.0 - Modern, fast bundler (Rspack-based)
- **@rsbuild/plugin-react**: v1.1.0 - React support for Rsbuild

### Styling
- **Tailwind CSS**: v3.4.15 - Utility-first CSS framework
- **PostCSS**: v8.4.49 - CSS processing
- **Autoprefixer**: v10.4.20 - Automatic vendor prefixing

## Project Structure

```
apps/fe/
├── src/
│   ├── App.tsx           # Main application component
│   ├── index.tsx         # Application entry point
│   ├── index.css         # Global styles with Tailwind directives
│   └── env.d.ts          # TypeScript environment declarations
├── rsbuild.config.ts     # Rsbuild configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Key Files

### `src/index.tsx`
- **Purpose**: Application entry point
- **Functionality**:
  - Imports global CSS styles
  - Creates React root using React 19's `createRoot` API
  - Renders the App component in StrictMode
  - Mounts to `#root` DOM element

### `src/App.tsx`
- **Purpose**: Main application component
- **Features**:
  - Landing page with gradient background (slate-900 → purple-900 → slate-900)
  - Centered layout with flexbox
  - Gradient text title "Plugilo" (cyan → violet → fuchsia)
  - Technology stack subtitle
  - Two CTA buttons:
    - Primary: Rsbuild Docs (violet-600 background)
    - Secondary: React Docs (bordered, translucent background)
  - Fully responsive with Tailwind utilities
  - Hover effects with transitions and shadows

### `src/index.css`
- **Purpose**: Global styles and Tailwind setup
- **Contents**:
  - Tailwind directives (@tailwind base/components/utilities)
  - CSS reset (box-sizing, margin, padding)
  - System font stack for body
  - Font smoothing for better rendering

### `rsbuild.config.ts`
- **Configuration**:
  - React plugin enabled
  - Dev server on port 3000
  - HTML title: "FE App"
  - Modern bundler settings

### `tailwind.config.js`
- **Configuration**:
  - Content scanning: `./src/**/*.{js,ts,jsx,tsx}`
  - Default theme (no custom extensions)
  - No additional plugins

### `tsconfig.json`
- **TypeScript Settings**:
  - Target: ES2022
  - Module: ESNext with bundler resolution
  - JSX: react-jsx (new JSX transform)
  - Strict mode enabled
  - No unused locals/parameters
  - Isolated modules for better build performance

## Development

### Available Scripts
```bash
pnpm dev      # Start development server (port 3000)
pnpm build    # Build for production
pnpm preview  # Preview production build
```

### Development Server
- Runs on `http://localhost:3000`
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components

## Styling Approach

### Tailwind Utilities Used
- **Layout**: `flex`, `min-h-screen`, `items-center`, `justify-center`
- **Spacing**: `px-4`, `py-3`, `mb-4`, `gap-4`
- **Colors**: Gradient backgrounds, violet/cyan/fuchsia accents, slate neutrals
- **Typography**: `text-6xl`, `font-bold`, `tracking-tight`
- **Effects**: `bg-gradient-to-r`, `bg-clip-text`, `hover:shadow-lg`
- **Transitions**: `transition-all` for smooth interactions

### Design System
- **Primary Color**: Violet (#8b5cf6)
- **Accent Colors**: Cyan, Fuchsia
- **Neutral**: Slate (900, 800, 700, 600, 500, 300, 200)
- **Background**: Dark theme with gradient overlays

## Build Output
- Modern ES modules
- Optimized for production
- Code splitting enabled
- CSS extracted and minified

## Integration Points
- Backend API: Expected at different origin (CORS-enabled backend at port 8000)
- No routing configured (single-page landing)
- No state management (can add Redux/Zustand as needed)

## Future Enhancements
Consider adding:
- React Router for multi-page navigation
- State management (Redux Toolkit, Zustand, or Jotai)
- API client for backend integration
- Component library (shadcn/ui, Radix UI)
- Form handling (React Hook Form)
- Data fetching (TanStack Query)
- Testing setup (Vitest, React Testing Library)

