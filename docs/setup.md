# PulseGrid — Setup

## Prerequisites
- Node.js 18+
- npm or yarn
- NVIDIA NIM API key (for AI features)

## Install

```bash
git clone https://github.com/YOUR_USERNAME/pulsegrid.git
cd pulsegrid
npm install
```

## Environment Variables

Create `.env.local`:

```bash
NIM_API_KEY=nvapi-your-key-here
```

The `NIM_API_KEY` is required for AI-powered features (enrichment, response plans, Q&A). The app works in demo mode without it using deterministic fallbacks.

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add `NIM_API_KEY` environment variable in Vercel dashboard
4. Deploy

```bash
# Or deploy via CLI
npx vercel --prod
```

## Demo Mode

No setup required. Click "Try Demo" on the landing page and select a scenario preset.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
