# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Starter project for a Claude Code course: a React expense tracker that originally shipped with an intentional bug, poor UI, and messy code, all meant to be fixed over the course. Expect to refactor rather than preserve existing patterns. So far the totals bug has been fixed and `App.jsx` has been split into components; the UI has not yet been reworked.

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

Vite 7 + React 19, plain JavaScript (JSX), no TypeScript, no router, no state library, no backend. `index.html` loads `src/main.jsx`, which renders `<App />` inside `StrictMode`.

### Component tree and data flow

```
App                 state: transactions (seeded), categories (constant)
├── Summary         props: transactions            → derives income / expenses / balance
├── TransactionForm props: categories, onAdd       state: description, amount, type, category
└── TransactionList props: transactions, categories, onDelete   state: filterType, filterCategory, pendingDelete
    └── ConfirmDialog  props: title, message, confirmLabel, onConfirm, onCancel   (rendered only while pendingDelete is set)
```

- `App` is the single source of truth for `transactions`. Data flows down via props; children change it only through callbacks: `TransactionForm` calls `onAdd(transaction)` with a fully built object (`id`, `date`, and numeric `amount` are set in the form), which `App` appends. A row's Delete button only sets `pendingDelete` in `TransactionList`, which opens `ConfirmDialog`; `onDelete(id)` is called (and `App` filters the row out) only when the user confirms.
- `ConfirmDialog` is a reusable modal on the native `<dialog>` element (`showModal()` on mount). It's controlled by conditional rendering in the parent rather than an `open` prop. Esc and backdrop clicks call `onCancel`. It uses plain buttons, not `<form method="dialog">`, because `App.css` has global `form` / `form button` styles that would leak in.
- State placement rule: data shared by more than one component lives in `App`; UI-only state (form inputs, filter selections) stays local to the component that uses it. Derived values (totals, filtered list) are computed during render, not stored in state.
- State is in-memory `useState` only; transactions reset on reload (no persistence).
- A transaction is `{ id, description, amount: number, type: "income" | "expense", category, date: "YYYY-MM-DD" }`. `categories` is a hardcoded array in `App.jsx`, passed to both the form and the list's category filter.

### Conventions

- One component per file directly in `src/`, named `PascalCase.jsx`, with a default export, imported with the explicit `.jsx` extension. Files should export only components (the `react-refresh` lint rule enforces this for Fast Refresh).
- Styling is plain CSS with class names: `src/App.css` holds styles for all components (no per-component CSS files), `src/index.css` holds globals.

## Known gotchas

- `amount` must be stored as a **number**. The form input yields a string, so `TransactionForm`'s `handleSubmit` converts it with `Number(amount)`; `Summary`'s `reduce` would otherwise concatenate strings.
- On Windows, stopping a backgrounded `npm run dev` can leave the Vite `node` process holding port 5173; kill it by port (`Get-NetTCPConnection -LocalPort 5173`) if the port stays busy.

## Lint config notes

ESLint uses the flat config (`eslint.config.js`) with `react-hooks` and `react-refresh` (Vite) presets. `no-unused-vars` ignores identifiers starting with an uppercase letter or `_`.
