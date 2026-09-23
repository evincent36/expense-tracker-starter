# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Starter project for a Claude Code course: a React expense tracker that intentionally ships with a bug, poor UI, and messy code, all meant to be fixed over the course. Expect to refactor rather than preserve existing patterns.

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint       # ESLint over all .js/.jsx files
```

There is no test framework or test script configured.

## Architecture

- Vite 7 + React 19, plain JavaScript (JSX), no TypeScript, no router, no state library, no backend.
- `index.html` loads `src/main.jsx`, which renders `<App />` inside `StrictMode`.
- The entire app lives in a single component, `src/App.jsx`: seed transaction data, form state, filter state, summary totals, the add-transaction form, and the transactions table. Styling is in `src/App.css` (component) and `src/index.css` (global).
- State is in-memory `useState` only; transactions reset on reload (no persistence).
- A transaction is `{ id, description, amount, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. Categories are a hardcoded array in `App.jsx` shared by the form and the category filter.

## Known gotchas

- `amount` must be stored as a **number**. The form input yields a string, so `handleSubmit` converts it with `Number(amount)`; the totals `reduce` would otherwise concatenate strings.

## Lint config notes

ESLint uses the flat config (`eslint.config.js`) with `react-hooks` and `react-refresh` (Vite) presets. `no-unused-vars` ignores identifiers starting with an uppercase letter or `_`.
