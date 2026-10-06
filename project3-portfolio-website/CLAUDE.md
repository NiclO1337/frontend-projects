# CLAUDE.md – Project 3: Portfolio Website (React)

The shared rules in the root `CLAUDE.md` apply here too. All agreed details
(pages, components, data, design tokens, effects, tests, build plan) live
in the context file:

@PROJECT3_CONTEXT.md

## Project in one sentence

Niclas Hugdahl's personal developer portfolio: a multi-page React app
(Vite + React Router) with a deep dark blue theme, light-blue neon effects,
a split layout inspired by Brittany Chiang's portfolio, and bento grids.

## Clean code first (most important rule)

- Prefer the **simplest solution that works**. Follow clean code principles:
  small components with one job, clear names, no duplicated logic, no
  dead code, no premature abstraction.
- **If a fix feels complicated, or a second fix is needed on top of an
  earlier fix: stop.** Step back, explain the root cause to the user, and
  suggest changing the approach instead of stacking patches. Ask before
  doing a larger refactor.
- If a library makes something much simpler, suggest it. Ask before adding
  any dependency that isn't in the context file.

## Tech rules

- **Vite 8 + React 19 + JavaScript (JSX)**. No TypeScript.
- **React Router v8** (package `react-router`, **not** `react-router-dom`),
  **data mode**: `createBrowserRouter` + `RouterProvider`. All routes live
  in `src/routes.jsx` so tests can reuse them with `createMemoryRouter`.
  v8 is newer than most tutorials, so **check reactrouter.com docs** before
  using an API you're unsure about, and don't copy v5/v6 patterns.
- Function components and hooks only. State as local as possible. Context
  only for app-wide settings (theme, effects).
- **No PropTypes.** React 19 ignores them. Document props with a short JSDoc
  comment above each component instead.
- Content lives in `src/data/*.js`, never hard-coded inside components.
  Rendering lists from data (`.map` with stable `key`s) is a core part of
  the project.
- Per-page `<title>` and `<meta name="description">` are rendered inside
  each page component (React 19 hoists them to `<head>`).
- Never put secrets in code. Env vars go in `.env` (git-ignored), with
  `.env.example` committed. Vite only exposes vars prefixed `VITE_`.

## Styling rules (CSS Modules)

- Every component has its own `ComponentName.module.css` next to it.
  Import as `import styles from "./Card.module.css"` and use
  `className={styles.card}`. Class names in camelCase.
- Global CSS only in `src/styles/`: `tokens.css` (custom properties for
  both themes), `global.css` (reset, base elements, fonts, focus styles,
  utility classes such as `.visually-hidden`).
- **Never hard-code colours, spacing or font sizes in modules.** Always use
  the tokens (`var(--color-accent)`, `var(--space-4)`, …).
- Combine classes with a template string. No `classnames` library needed.
- Mobile first: base styles, then `@media (min-width: 768px)` and
  `@media (min-width: 1024px)`.
- Hover and focus effects use the neon tokens. Every hover effect must also
  have a matching `:focus-visible` style.

## Effects and performance rules

- The cursor trail, custom cursor and Motion animations must:
  - be **off** when the effects toggle is off
  - be **off** with `prefers-reduced-motion: reduce`
  - be **off** on touch devices (`(hover: none)` or `(pointer: coarse)`)
  - stop their `requestAnimationFrame` loop when idle or when the tab is hidden
- No canvas `shadowBlur` (too slow). Fake glow with layered strokes or gradients.
- Animate only `transform` and `opacity`. Never animate layout properties
  (`width`, `top`, `margin`, …).
- After adding an effect, ask the user to check smoothness in DevTools →
  Performance with 4× CPU throttling.

## Testing rules

- **Vitest + React Testing Library + jsdom.** The test file sits next to
  the component: `ProjectCard.test.jsx`.
- Write the component's unit tests **in the same commit** as the component.
- Test behaviour, not implementation: query by role/label/text
  (`getByRole("button", { name: /dark mode/i })`), interact with
  `userEvent`. No snapshot tests.
- Integration tests (end of project) live in `src/test/integration/` and
  render the real routes with `createMemoryRouter`.
- Never call real network services in tests. Mock `fetch` with `vi.fn()`.
- The user runs `npm test` themselves. Tell them which test file to run and
  what should pass.

## Commands (the user runs them, never you)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (**never start it yourself**; ask the user to check) |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Vitest once (CI style) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run build` | Production build |

## When writing code

- Follow the build plan in `PROJECT3_CONTEXT.md`, one step per commit.
  Say which step you are on.
- Explain React concepts the first time they appear (props, state,
  effects, context, custom hooks, route params, loaders, search params),
  because the user is learning React Router in this project.
- Commit messages start with `project-3: ` and are very short.
