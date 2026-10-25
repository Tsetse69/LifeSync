# LifeSync — Student Planner & Financial Tracker

LifeSync helps students keep their studies and their spending in one place. Add classes, exams, personal time and expenses, see them on a month calendar or a sorted list, and keep an eye on monthly spending with automatic weekly and daily targets. Amounts can be shown in Korean won (₩) or US dollars ($).

## Features

- Month calendar and list views, with search and category filters (Academic, Expense, Personal, Exam)
- Expense targets for the month shown on the calendar: the total, plus weekly and daily allocations
- Switch between KRW and USD (amounts are stored in USD and converted at 1 USD = 1,350 KRW)
- Reminder banner and optional browser notifications for items due today or tomorrow
- Export your data to a JSON backup file and import it again
- Light and dark themes (your choice is saved)
- All data stays in the browser's `localStorage`. No account or server is needed.

## Technology

- One static HTML file: `public/index.html`
- Tailwind CSS (Play CDN) and the Inter font from Google Fonts
- Plain JavaScript with no build step
- Hosted on Netlify (`netlify.toml` publishes the `public/` folder)

## Running locally

Open `public/index.html` in a browser, or serve it with the Netlify CLI:

```bash
netlify dev --port 8889
```
