# 🏋️ Gym AI Onboarding System

A full-stack web app that generates personalised diet and workout plans for gym members using AI — instantly, on sign-up.

Built as a showcase for selling AI + automation systems to local gyms.

---

## What it does

1. New member fills a 3-step onboarding form (name, goals, food preference, fitness level)
2. Their answers are sent to Claude (Anthropic's AI) via a Node.js backend
3. Claude generates a personalised diet plan + workout schedule in seconds
4. In a real deployment, this plan is delivered to the member's WhatsApp automatically

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI | Claude API (claude-sonnet-4-6) |
| Styling | Plain CSS |

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/gym-ai-onboarding.git
cd gym-ai-onboarding
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
# Add your Anthropic API key to .env
npm install
npm start
```

Get your API key at: https://console.anthropic.com

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Project structure

```
gym-ai-onboarding/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── OptionGrid.jsx
│   │   │   ├── StepDetails.jsx
│   │   │   ├── StepGoals.jsx
│   │   │   ├── StepFitness.jsx
│   │   │   └── PlanResult.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
├── backend/
│   ├── server.js
│   └── .env.example
└── README.md
```

---

## How this fits into the full system

This frontend is one piece of a larger gym automation stack:

- **Make** — automation engine (watches Airtable, triggers flows)
- **Tally** — embeddable version of this form
- **Interakt** — WhatsApp Business API delivery
- **Airtable** — member database + renewal tracking
- **Claude API** — this app + weekly check-in responses

---

## License

MIT
