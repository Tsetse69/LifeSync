# AGENTS.md

## Architecture
LifeSync is a single static page with no build step. All markup, Tailwind config, and JavaScript live in `public/index.html`. `netlify.toml` publishes `public/` as the site root. There are no functions and no backend.

## State and persistence
- `items` is an array of `{ id, title, category, date (YYYY-MM-DD, local time), amount (USD or null), priority, reminder }`.
- It is stored in `localStorage` under `lifesync_items`. The other keys are `lifesync_currency` (`KRW` | `USD`) and `lifesync_theme` (`dark` | `light`).
- Amounts are always stored in **USD**. `formatMoney()` converts for display using `USD_TO_KRW_RATE`, and KRW input is converted back to USD when an item is added.

## Conventions
- After any state change, call `saveToLocalStorage()` and then `renderApp()`. `renderApp()` re-renders the calendar, the list, and the expense stats.
- Always pass user-supplied or imported text through `escapeHTML()` before putting it into `innerHTML` templates. Pass ids through `data-*` attributes, not inline JS strings.
- Build dates with `getFormattedDate()`, which uses the local date. Do not use `toISOString()`, because it is UTC and shifts days for users in KST.
- The expense stats cover the month currently shown on the calendar (`currentDisplayDate`).
- Style with Tailwind utility classes. Brand colours are defined in the inline `tailwind.config` (`brand-*`, violet).

## If persistence across devices is ever needed
Add Netlify Identity for accounts and Netlify Database for items. Until then, keep the app client-only.
