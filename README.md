# Financial Risk Radar · Middle-class India

A web app that visualizes and scores key financial risks for middle-class Indian households. Enter your numbers to see a radar chart and AI-style insights.

## Risk dimensions

- **Emergency Fund** – Months of expenses in liquid savings (target: 6+ months)
- **Debt Burden** – EMI as % of income (target: under 35%)
- **Savings Rate** – % of income saved (target: 20%+)
- **Insurance Cover** – Life (10–12× income) and health (₹5L+)
- **Retirement Readiness** – Corpus vs 25× annual expense rule
- **Inflation Protection** – Equity/debt mix (e.g. 100 − age in equity)

Scoring uses norms aligned to RBI household data and common Indian financial advisory guidelines.

## Run locally

```bash
cd financial-risk-radar
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Stack

- React (Vite)
- Chart.js (radar)
- Vanilla CSS (dark theme)

*For educational use. Not investment or tax advice.*
