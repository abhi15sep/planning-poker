# Planning Poker

A real-time planning poker application for agile estimation, built with React, TypeScript, TailwindCSS, and Supabase.

## Features

- Create and join rooms with shareable URLs
- Multiple card decks (Fibonacci, Scrum, Sequential, T-shirt sizing)
- Real-time voting with hidden cards until reveal
- Vote statistics (average, median, mode, agreement)
- Story management with bulk import
- Voting timer with auto-reveal
- Dark mode support
- CSV export of completed stories

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with dark mode
- **Routing**: React Router v6
- **State**: Zustand (local) + Supabase Realtime (sync)
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Deployment**: GitHub Pages

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd poker
npm install
```

### 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your Project URL and anon key from Settings > API

### 3. Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

## Deployment to GitHub Pages

1. Add secrets to your GitHub repository (Settings > Secrets):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Push to main branch - deployment is automatic via GitHub Actions

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## License

MIT
