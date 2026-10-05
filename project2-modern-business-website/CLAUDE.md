# CLAUDE.md – Project 2: Bun Intended (Modern Business Website)

The shared rules in the root `CLAUDE.md` apply here too. All agreed details
(business, pages, design tokens, JS features, build plan) live in the
context file:

@PROJECT2_CONTEXT.md

## Project in one sentence

A multi-page website for **Bun Intended**, a fictional burger restaurant on
Södermalm in Stockholm: a bit more upscale than fast food, with a dark
"ketchup & mustard" theme. Built with HTML, Bootstrap 5.3 and vanilla JS.

## Hard rules for this project

- **Allowed:** HTML5, **Bootstrap 5.3** (CSS + JS bundle from the jsDelivr
  CDN), one custom stylesheet `assets/css/style.css`, vanilla JS in
  `assets/js/`, Google Fonts, Font Awesome Free (cdnjs).
- **Not allowed:** Sass, npm packages, build tools, jQuery, frameworks,
  other libraries. No ES modules (`type="module"`) – they don't work when
  `index.html` is opened straight from the file system. Use plain `<script defer>`.
- **Dark theme only.** `<html lang="en" data-bs-theme="dark">` on every page.
  No light mode, no theme toggle.
- **Theme Bootstrap with CSS variables in `style.css`**, which loads *after*
  Bootstrap. Override `--bs-*` variables and component variables
  (e.g. `.btn-primary { --bs-btn-bg: … }`) instead of fighting Bootstrap
  with `!important`.
- **Use Bootstrap's breakpoints** (576 / 768 / 992 / 1200px) and its grid.
  Navbar collapses below `lg` (992px).
- **Hover effects only on links and buttons** (including the logo link),
  with one exception: the burger logo (`.logo-burger`) may always have hover
  animations, wherever it appears (navbar, footer, hero). Menu items, cards
  and images don't change on hover.
- Every animation must stop under `prefers-reduced-motion: reduce`.
- No unit tests – testing is manual and documented in `TESTING.md`.
- Commit messages start with `project-2: ` and are very short.

## Shared header and footer

The navbar and footer are **copied into every HTML page** (no JS
includes). When either one changes, update **all six pages** in the same
commit and mention it. On each page, the current nav link gets
`class="nav-link active"` and `aria-current="page"`.

## Single sources of truth

- **Opening hours:** the hours table on `hours-location.html` and the
  `OPENING_HOURS` object in `assets/js/hours.js` must always match. If one
  changes, change the other in the same commit.
- **Menu items:** `menu.html` is the master list. `allergens.html` and the
  featured dishes on the home page must use the same names and prices.

## Files

| Path | Purpose |
|------|---------|
| `index.html` | Home: hero with animated logo, image slider, welcome, featured dishes |
| `menu.html` | Menu with category filter |
| `our-story.html` | The restaurant's history |
| `hours-location.html` | Opening hours, open-now badge, address, map, photos |
| `book.html` | Table booking form (front-end only, nothing is sent) |
| `allergens.html` | Allergen table (linked from footer and menu) |
| `assets/css/style.css` | All custom styles and Bootstrap overrides |
| `assets/js/hours.js` | `OPENING_HOURS` data + helper functions (shared) |
| `assets/js/open-status.js` | Open now / Closed badge (hours page) |
| `assets/js/menu-filter.js` | Category filter (menu page) |
| `assets/js/booking-form.js` | Booking form validation + confirmation (book page) |
| `assets/images/` | Logo, favicon, photos (WebP) |
| `readme-assets/` | Sitemap, wireframes, colour scheme, screenshots – not part of the site |

Each page loads only the scripts it needs. Load order matters:
`bootstrap.bundle.min.js` → `hours.js` → the page script.

## When writing code

- Follow the build plan in `PROJECT2_CONTEXT.md`, one step per commit.
  Say which step you are on.
- Use Bootstrap classes for layout and spacing first. Write custom CSS only
  for the brand look (colours, fonts, logo, cards, badges).
- Keep `style.css` in this section order: 1 tokens and Bootstrap variable
  overrides → 2 base and typography → 3 layout helpers → 4 components
  (navbar, logo, buttons, cards, menu, timeline, forms, footer) →
  5 page-specific → 6 animations and reduced motion.
- JS: use `const`/`let`, small named functions, `addEventListener`, no
  inline `onclick`. Explain new concepts (data attributes, `Intl`,
  Constraint Validation API) in a short comment the first time.
- All content is fictional. Use the placeholder contact details from the
  context file.
