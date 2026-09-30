# CLAUDE.md – frontend-projects (monorepo)

Shared rules for all projects in this repo. Each project folder has its own
`CLAUDE.md` and `PROJECTx_CONTEXT.md` with project-specific details – read
those before working inside a project.

## Repo layout

```
frontend-projects/
├── CLAUDE.md                          ← this file (shared rules)
├── README.md                          ← short repo overview
├── docs/                              ← private planning notes, GIT-IGNORED
├── project1-modern-cv-webpage/        ← HTML + CSS (+ a little vanilla JS)
├── project2-modern-business-website/
└── project3-portfolio-website/
```

- Only work inside the project folder the user is currently working on.
  Never change files in another project's folder unless explicitly asked.
- `docs/` is git-ignored (and `.gitignore` ignores **every** folder named
  `docs`, at any depth). Never put files that must be committed in a folder
  called `docs` – use `readme-assets/` for README images and wireframes.
- Each project is deployed as its own Vercel project with the project folder
  as Vercel's **Root Directory**.

## How we work

- **Never run a dev server** or open a browser. After a change, tell the user
  what to look at and let them check it manually.
- Work in **small chunks that fit in one commit**. Finish one chunk, stop,
  and let the user review before continuing.
- **Always suggest a commit** after each change, with a message that:
  - starts with the project prefix: `project-1: `, `project-2: ` or `project-3: `
  - is very short (aim for under 50 characters), lower case, imperative
  - example: `project-1: add sidebar layout`
- The user commits and pushes themselves. Only commit if explicitly asked.
- All work happens directly on the `main` branch – no feature branches.
- Explain *why* when introducing a new technique – these are school
  projects and the user should understand every line.

## Code standards (all projects)

- Semantic HTML5 and best practices: one `<h1>`, logical heading order,
  landmarks (`header`, `main`, `footer`), `alt` text on every image, labels
  on icon-only buttons (`aria-label`), decorative icons get `aria-hidden="true"`.
- Mobile-first CSS: base styles for small screens, then `min-width` media
  queries.
- Use CSS custom properties for colours, spacing and fonts – no hard-coded
  hex values outside the `:root` token blocks.
- Keep colour contrast at WCAG AA or better (4.5:1 for normal text).
- Visible `:focus-visible` styles on everything that can be focused.
- Respect `prefers-reduced-motion` if anything animates.
- Keep code readable over clever: clear class names, short comments that
  explain intent, no dead code.
- Never publish sensitive personal data (real phone number, home address,
  personal email). Use placeholders.

## Docs

- Each project has `README.md` (following the user's README template),
  `TESTING.md`, and `readme-assets/` for wireframes and screenshots.
- Leave `TODO` markers in README sections that can only be filled in later
  (screenshots, live URL, testing results). Don't invent results.
