# CritVid - Video Critique Platform

## Manual Code Editing Guide

**YES, you can absolutely edit the code manually!** This is a standard React + TypeScript + Vite project.

### Getting Started

1. **Clone/Download** the project to your local machine
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
4. **Open your editor** (VS Code, WebStorm, etc.) and start editing!

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions & services
├── types/              # TypeScript type definitions
└── data/               # Mock data & constants
```

### Key Files to Edit

- **`src/App.tsx`** - Main app routing
- **`src/components/`** - All UI components
- **`src/pages/`** - Page-level components
- **`tailwind.config.ts`** - Styling configuration
- **`package.json`** - Dependencies & scripts

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Manual Cleanup Required

See `CLEANUP_REQUIRED.md` for files that need manual deletion to complete the video editor consolidation.

### Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for routing

Happy coding! 🚀