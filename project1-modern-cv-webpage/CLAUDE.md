# CLAUDE.md – Project 1: Modern CV Web Page

The shared rules in the root `CLAUDE.md` apply here too. All agreed details
(design tokens, layout, content, build plan) live in the context file:

@PROJECT1_CONTEXT.md

## Project in one sentence

A one-page, responsive CV website for Niclas Hugdahl that looks like a modern
Canva CV: a dark navy sidebar and a white main column. Built with plain HTML
and CSS plus a tiny bit of vanilla JS.

## Hard rules for this project

- **Vanilla only**: HTML5, one external stylesheet `style.css`, and one small
  `script.js`. No CSS frameworks (no Bootstrap, no Tailwind), no build tools,
  no npm packages.
- Allowed external resources: **Google Fonts** (Sora + Inter) and
  **Font Awesome Free** via the cdnjs CSS link. Nothing else.
- `script.js` has only one job: the dark/light theme toggle. Don't add other JS
  unless the user asks for it.
- **No hover effects** except on real buttons (theme toggle, Download CV).
  Headings, the profile photo, skill items and cards must not change on
  hover and must not look clickable (no `cursor: pointer`, no pill "buttons").
- **No navigation menu**, no animations, no skill progress bars, no print
  stylesheet. These were deliberately left out to keep the project small.
- No unit tests for this project. Testing is manual and documented in
  `TESTING.md`.
- Commit messages start with `project-1: ` and are very short.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The whole CV page |
| `style.css` | All styles, mobile-first, organised in commented sections |
| `script.js` | Theme toggle (dark/light) only |
| `assets/images/` | Profile photo (placeholder at first), favicon |
| `assets/cv/` | The downloadable CV as a PDF |
| `readme-assets/` | Wireframes, colour scheme and screenshots used by the README – not part of the site |
| `README.md`, `TESTING.md` | Project documentation |

## When writing code

- Follow the build plan in `PROJECT1_CONTEXT.md` step by step, one step per
  commit. Say which step you are on.
- Keep `style.css` in this section order: 1 tokens → 2 reset/base →
  3 typography → 4 layout → 5 components → 6 utilities → 7 media queries
  (768px, then 1024px).
- Use the colour tokens exactly as defined in the context file. If a new
  colour is needed, add a token and check its contrast first.
- The CV text comes from the user's real CV. Ask the user for it instead of
  inventing content. Contact details stay placeholders.
