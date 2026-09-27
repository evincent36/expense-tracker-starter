# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Starter project for a Claude Code course: a React expense tracker that originally shipped with an intentional bug, poor UI, and messy code, all meant to be fixed over the course. Expect to refactor rather than preserve existing patterns. So far the totals bug has been fixed, `App.jsx` has been split into components, and the UI has been rebuilt on Fluent UI React v9 (the balance as a headline sentence, income in neutral ink, expenses in red).

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint       # ESLint over all .js/.jsx files
```

There is no test framework or test script configured.

Deploy with `/deploy` (`.claude/skills/deploy/SKILL.md`). It runs lint (plus `npm test` once that script exists), then builds, then pushes `HEAD` to the `staging` branch on `origin`. It only runs from a clean `main` that has already been pushed to `origin`.

## Architecture

Vite 7 + React 19, plain JavaScript (JSX), no TypeScript, no router, no state library, no backend. UI components come from Fluent UI React v9 (`@fluentui/react-components`, icons from `@fluentui/react-icons`); the chart is Recharts. `index.html` loads `src/main.jsx`, which renders `<App />` inside `StrictMode`. `App` wraps everything in `FluentProvider`, and switches between `webLightTheme` and `webDarkTheme` to follow the OS `prefers-color-scheme` setting.

### Component tree and data flow

```
App                 state: transactions (seeded), categories (constant)
├── Summary         props: transactions            → derives income / expenses / balance ("You're $X in the black/red.")
├── SpendingChart   props: transactions            → derives totals per category and type: one bar per side, so a category with both income and expenses gets two bars (Recharts horizontal bar chart)
└── TransactionList props: transactions, categories, onDelete, children   state: filterType, filterCategory, pendingDelete
    ├── TransactionForm props: categories, onAdd   state: description, amount, type, category   (passed by App as `children`, rendered above the table)
    └── ConfirmDialog  props: title, message, confirmLabel, onConfirm, onCancel   (rendered only while pendingDelete is set)
```

- `App` is the single source of truth for `transactions`. Data flows down via props; children change it only through callbacks: `TransactionForm` calls `onAdd(transaction)` with a fully built object (`id`, `date`, and numeric `amount` are set in the form), which `App` appends. A row's Delete button only sets `pendingDelete` in `TransactionList`, which opens `ConfirmDialog`; `onDelete(id)` is called (and `App` filters the row out) only when the user confirms.
- `ConfirmDialog` is a reusable wrapper around Fluent's `Dialog` (always `open`). It's controlled by conditional rendering in the parent rather than an `open` prop. Fluent's `onOpenChange` (Esc, backdrop click) calls `onCancel`.
- State placement rule: data shared by more than one component lives in `App`; UI-only state (form inputs, filter selections) stays local to the component that uses it. Derived values (totals, filtered list) are computed during render, not stored in state.
- State is in-memory `useState` only; transactions reset on reload (no persistence).
- A transaction is `{ id, description, amount: number, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. `categories` is a hardcoded array in `App.jsx`, passed to both the form and the list's category filter.

### Conventions

- One component per file directly in `src/`, named `PascalCase.jsx`, with a default export, imported with the explicit `.jsx` extension. Files should export only components (the `react-refresh` lint rule enforces this for Fast Refresh).
- Styling is plain CSS with class names: `src/App.css` holds styles for all components (no per-component CSS files), `src/index.css` holds globals plus the two chart series colors (`--chart-income`, `--chart-expense`, with dark-mode values). Colors come from Fluent's theme CSS variables (`var(--colorNeutralForeground3)`, `var(--colorPaletteRedForeground1)`, …) rather than raw hex, so the light and dark themes both work. Components are not styled with `makeStyles`.
- Fluent injects its own single-class style rules at runtime, and they win ties with `App.css`. To override a Fluent component, double up the selector (`.panel.fui-Card`, `.fui-FluentProvider.app-root`, `.summary .summary-headline`).
- Recharts sets colors as SVG attributes, which can't read CSS variables, so the bars (`Cell className="bar-income"`), ticks, and grid are colored from `App.css` via CSS `fill`/`stroke`.
- Money and dates go through `src/format.js`: `formatMoney` and `formatDate` for display, and `todayIso` for new transactions. `todayIso` gives the *local* date; `toISOString()` gives the UTC date, which is already tomorrow on evenings west of UTC. It's a plain module, not a component.

## Known gotchas

- `amount` must be stored as a **number**. The form input yields a string, so `TransactionForm`'s `handleSubmit` converts it with `Number(amount)`; `Summary`'s `reduce` would otherwise concatenate strings.
- On Windows, stopping a backgrounded `npm run dev` can leave the Vite `node` process holding port 5173; kill it by port (`Get-NetTCPConnection -LocalPort 5173`) if the port stays busy.

## Lint config notes

ESLint uses the flat config (`eslint.config.js`) with `react-hooks` and `react-refresh` (Vite) presets. `no-unused-vars` ignores identifiers starting with an uppercase letter or `_`.
