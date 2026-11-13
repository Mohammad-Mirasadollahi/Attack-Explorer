# Attack Explorer

Interactive workbench for exploring cyber-attack scenarios: kill-chain visuals, Sysmon/SIEM-style telemetry, and MITRE ATT&CK mapping.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Optional in `.env.local`:

```env
GEMINI_API_KEY=your_key
APP_URL=http://localhost:3000
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production build |

## API

```http
GET /api/attacks?category=ALL&mitrePhase=ALL&severity=ALL&search=
```
