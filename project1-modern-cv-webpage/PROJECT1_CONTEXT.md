# PROJECT1_CONTEXT – Modern CV Web Page

Agreed plan for Project 1. It replaces `docs/project1-modern-cv-webpage.md`:
everything from the school brief that matters is summarised here.

**Motto from the brief:** Simple + Clean + Responsive + Professional.
Don't build a complex application; show solid HTML, CSS and UI design.

---

## 1. Requirements from the brief (must have)

- [ ] Plan first: sections decided, wireframes, colour + typography scheme
- [ ] HTML5 with semantic elements
- [ ] Sections: **Header/Profile** (name, professional title, short summary),
      **About Me**, **Skills**, **Education**, **Experience** (or Projects),
      **Contact** (placeholder, non-sensitive info)
- [ ] CSS3 in an **external stylesheet** (`style.css`)
- [ ] Flexbox and/or CSS Grid (we use both)
- [ ] Good typography, spacing, alignment, colours, visual hierarchy,
      readability, consistency
- [ ] Works on desktop and mobile, uses media queries, tested at many sizes
- [ ] Public GitHub repo containing `index.html`, `style.css`, assets, `README.md`
- [ ] Deployed with a live URL (Vercel)

Submission: GitHub repository URL + live website URL.

---

## 2. Agreed decisions

| Topic | Decision |
|-------|----------|
| Repo | Monorepo `NiclO1337/frontend-projects`, folder `project1-modern-cv-webpage/`, work on `main` only |
| Deployment | Vercel, one Vercel project per folder (Root Directory = `project1-modern-cv-webpage`) |
| Content | Niclas's real CV, in English only |
| Contact info | Placeholders (email, phone). LinkedIn/GitHub links are OK (already public) |
| Photo | Profile photo, placeholder image to start with |
| Extra section | **Languages**: Swedish (native), English (fluent) |
| Layout | Canva-style CV: navy sidebar + white main column. Stacks to one column on mobile, with the sidebar on top |
| Colours | Dark navy with lighter blue accents (tokens in §6) |
| Fonts | **Sora** for headings, **Inter** for body text (Google Fonts) |
| Icons | Font Awesome Free (cdnjs) |
| JavaScript | Yes, but only for the theme toggle |
| Optional features | **Dark mode** + **Download CV** button |
| Left out on purpose | Hover effects (except on buttons), navigation menu, animations, skill bars, print stylesheet |
| CSS approach | Mobile-first, custom properties, breakpoints **768px** and **1024px** (to be fine-tuned at the end) |
| README | Same structure as the Strawberry Lovers template, with testing in `testing.md` |
| README images | Stored in the repo in `readme-assets/` (not Cloudinary, not `docs/`, because `docs/` is git-ignored) |
| Testing | Manual only, no unit tests |

---

## 3. File structure

```
project1-modern-cv-webpage/
├── CLAUDE.md
├── PROJECT1_CONTEXT.md
├── README.md
├── testing.md
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/
│   │   ├── profile-placeholder.webp   → later replaced by profile.webp
│   │   └── favicon.svg (or .ico)
│   └── cv/
│       └── niclas-hugdahl-cv.pdf
└── readme-assets/
    ├── wireframes/  desktop.svg, mobile.svg
    ├── colour-scheme.svg
    └── screenshots/ (added at the end)
```

---

## 4. Page structure (semantic HTML outline)

```html
<body>
  <div class="toolbar">                    <!-- above the CV "paper" -->
    <button class="btn-icon theme-toggle" aria-label="Switch to dark mode" aria-pressed="false">
      <i class="fa-solid fa-moon" aria-hidden="true"></i>
    </button>
    <a class="btn" href="assets/cv/niclas-hugdahl-cv.pdf" download>
      <i class="fa-solid fa-download" aria-hidden="true"></i> Download CV
    </a>
  </div>

  <div class="cv">                          <!-- the CV card, a grid on desktop -->
    <div class="sidebar">                   <!-- navy column -->
      <header class="profile">
        <img class="profile-photo" src="assets/images/profile-placeholder.webp" alt="Portrait of Niclas Hugdahl" width="160" height="160">
        <h1>Niclas Hugdahl</h1>
        <p class="profile-title">TODO professional title</p>
        <p class="profile-summary">Short 2–3 sentence summary</p>
      </header>
      <section aria-labelledby="contact-heading"> … <address> list with icons </address></section>
      <section aria-labelledby="skills-heading"> … grouped <ul> lists </section>
      <section aria-labelledby="languages-heading"> … <ul> </section>
    </div>

    <main class="content">                  <!-- white column -->
      <section id="about" aria-labelledby="about-heading"> … </section>
      <section id="experience" aria-labelledby="experience-heading">
        <ol class="timeline"> <li> <article> h3 role, company, <time>, text </article> </li> </ol>
      </section>
      <section id="education" aria-labelledby="education-heading"> same timeline pattern </section>
    </main>
  </div>

  <footer> © 2026 Niclas Hugdahl </footer>
  <script src="script.js" defer></script>
</body>
```

Notes:
- The sidebar is a `<div>`, not an `<aside>`: contact and skills are core CV
  content, not side content.
- The `<h1>` is the name. Section headings are `<h2>`, entries are `<h3>`.
- Dates use `<time datetime="2024-08">`.
- Contact uses `<address>` with `mailto:` / `tel:` links (placeholders) and
  links to LinkedIn/GitHub. External links get `target="_blank"` and
  `rel="noopener noreferrer"`, and their text says where they go.
- Skills are plain grouped lists with small icons, **not** pill-shaped tags,
  so nothing looks clickable.
- Profile photo is not a link and has no hover effect.

---

## 5. Layout and responsive behaviour

Mobile first. See `readme-assets/wireframes/` for sketches.

| Width | Layout |
|-------|--------|
| **< 768px** (base) | One column. Toolbar top right. CV card fills the width. Sidebar (navy) on top: photo, name, title, summary, contact, skills, languages. Then main: about, experience, education. Footer. |
| **≥ 768px** | Still one column, but the card gets side margins and rounded corners. Sidebar content uses a grid: profile header across the full width, then **contact / skills / languages side by side**. |
| **≥ 1024px** | Two columns: `grid-template-columns: 320px 1fr`. Navy sidebar on the left, full height of the card. Card max-width ~1100px, centred, with a soft shadow, like a sheet of paper. |

- Experience and Education use a **timeline**: a left border line with a
  dot per entry, made with `::before`. Good practice for positioning.
- Entry header: role (h3) on the left, dates on the right using flexbox
  with `flex-wrap` (dates drop below the title on narrow screens).

---

## 6. Design system

### Colours (CSS custom properties)

Contrast ratios were checked (WCAG AA needs 4.5:1 for normal text).

| Token | Light | Dark | Used for |
|-------|-------|------|----------|
| `--color-bg` | `#f4f7fb` | `#0b1426` | Page background behind the card |
| `--color-surface` | `#ffffff` | `#13223f` | Main column / card |
| `--color-sidebar` | `#0f1f3d` | `#0a1630` | Navy sidebar |
| `--color-text` | `#1b2537` | `#e6edf7` | Body text on surface |
| `--color-text-muted` | `#55627a` | `#a3b1c7` | Dates, company names |
| `--color-accent` | `#2563eb` | `#8cc4ff` | Heading underline, timeline dots, links, button bg |
| `--color-on-accent` | `#ffffff` | `#0a1630` | Text on accent buttons |
| `--color-sidebar-text` | `#e6edf7` | `#e6edf7` | Text in sidebar |
| `--color-sidebar-muted` | `#a9b8d0` | `#a9b8d0` | Secondary text in sidebar |
| `--color-sidebar-accent` | `#8cc4ff` | `#8cc4ff` | Title, icons and headings in sidebar |
| `--color-border` | `#d6e0ee` | `#24375a` | Dividers, timeline line |

Checked contrast: text/surface 15.4 (light) and 13.4 (dark) · muted/surface
6.2 and 7.3 · accent/surface 5.2 and 8.6 · sidebar text 13.9 · sidebar
accent 8.9 · sidebar muted 8.1 · button text on accent 5.2 and 9.8.

Dark mode implementation:
```css
:root { /* light tokens */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark tokens */ }
}
:root[data-theme="dark"] { /* dark tokens */ }
```
`script.js`: on click, toggle `data-theme` on `<html>` between `light` and
`dark`, save the choice in `localStorage`, swap the moon/sun icon, and update
`aria-label` and `aria-pressed`. On load, apply a saved choice if one exists.
Otherwise follow the OS setting (the CSS above handles that).

### Typography

- Google Fonts: **Sora** 600/700 (headings), **Inter** 400/500/600 (body),
  `display=swap`, with `preconnect`. Fallback: `system-ui, sans-serif`.
- Base: `font-size: 1rem; line-height: 1.6`.
- `h1` (name): Sora 700, `clamp(2rem, 1.6rem + 1.6vw, 2.75rem)`.
- `h2` (section headings): Sora 600, ~1.125rem, uppercase,
  `letter-spacing: 0.08em`, short accent-coloured bar underneath (`::after`).
- `h3` (entries): Inter 600, ~1.05rem.
- Profile title: sidebar accent colour, 500 weight.
- Keep text lines at max ~70ch in the main column.

### Spacing, shapes

- Spacing scale: `--space-1: 0.25rem`, `--space-2: 0.5rem`, `--space-3: 1rem`,
  `--space-4: 1.5rem`, `--space-5: 2rem`, `--space-6: 3rem`.
- `--radius: 8px`; profile photo round (`border-radius: 50%`) with a 4px
  accent-coloured ring.
- Card shadow (≥1024px): `0 10px 30px rgb(15 31 61 / 0.12)`.

### Buttons (the only hover states)

- `.btn` (Download CV): accent background, on-accent text, radius, icon + text.
  Hover: slightly darker/lighter. `:focus-visible`: 3px outline, offset 2px.
- `.btn-icon` (theme toggle): round 40×40px, transparent with border.
  Same hover and focus rules.
- Minimum touch target: 40×40px.

---

## 7. Content

Source: **Niclas's own CV.** Claude Code should ask for the CV text when
reaching the content step. Don't invent anything.

| Section | Content |
|---------|---------|
| Name | Niclas Hugdahl |
| Professional title | TODO (from CV) |
| Summary | TODO: 2–3 sentences |
| About Me | TODO: 1–2 short paragraphs |
| Contact | Email `hello@example.com`, phone `+46 70 000 00 00`, location (city/country only), LinkedIn TODO, GitHub `github.com/NiclO1337` |
| Skills | TODO: grouped, e.g. Frontend / Backend / Tools |
| Languages | Swedish – Native · English – Fluent |
| Experience | TODO: role, company, location, dates, 1–3 bullets each |
| Education | TODO: programme, school, dates, short note (incl. Lexicon C# course) |

**Privacy:** the Download CV PDF must be a version with the **same
placeholder contact info** as the website. No real phone number, personal
email or home address in the repo, since it's public.

---

## 8. Accessibility checklist

- `lang="en"` on `<html>`, meta viewport, meaningful `<title>` and meta
  description
- Exactly one `<h1>`, no skipped heading levels
- `alt` text on the photo, `aria-hidden="true"` on decorative icons
- Icon-only theme button has an `aria-label` that says what it will do
- Visible `:focus-visible` on links and buttons
- Colour is never the only way information is shown
- Sections use `aria-labelledby` pointing at their `h2`
- Test with keyboard only (Tab through the page) and with the WAVE extension

---

## 9. Build plan (one step = one commit)

| # | Step | Suggested commit |
|---|------|------------------|
| 1 | HTML boilerplate: head, meta tags, Google Fonts, Font Awesome, stylesheet, script | `project-1: add html boilerplate` |
| 2 | Semantic page skeleton with all sections and placeholder text | `project-1: add page structure` |
| 3 | Real CV content from the user's CV (placeholder contact info) | `project-1: add cv content` |
| 4 | Placeholder profile image + favicon | `project-1: add images` |
| 5 | CSS tokens (light), reset/base, typography | `project-1: add base styles` |
| 6 | Mobile layout: toolbar, card, sidebar, main spacing | `project-1: style mobile layout` |
| 7 | Sidebar components: photo, contact list, skills, languages | `project-1: style sidebar` |
| 8 | Timeline for experience and education | `project-1: add timeline styles` |
| 9 | Buttons + focus styles | `project-1: style buttons` |
| 10 | 768px breakpoint (sidebar content grid) | `project-1: add tablet layout` |
| 11 | 1024px breakpoint (two-column card) | `project-1: add desktop layout` |
| 12 | Dark mode tokens + `script.js` theme toggle | `project-1: add dark mode` |
| 13 | Download CV: add PDF (placeholder contacts) + link | `project-1: add cv download` |
| 14 | Validate HTML/CSS, Lighthouse, WAVE, fixes | `project-1: fix validation issues` |
| 15 | Deploy to Vercel, add live URL to README | `project-1: add live url` |
| 16 | Screenshots, finish README + testing.md | `project-1: update readme` |

Final tweak of breakpoints and spacing happens after step 12 when the real
content is in place.

---

## 10. Deployment (Vercel)

1. Vercel → Add New → Project → import `NiclO1337/frontend-projects`.
2. **Root Directory:** `project1-modern-cv-webpage`.
3. Framework Preset: **Other**. No build command, no output directory
   (static files are served as they are).
4. Deploy, then copy the live URL into the README.
5. Optional: so pushes to other projects don't redeploy this one, set
   Settings → Git → **Ignored Build Step** to
   `git diff HEAD^ HEAD --quiet -- .`

---

## 11. Definition of done (brief's final checklist)

- [ ] HTML valid (W3C) and well structured
- [ ] CSS valid (Jigsaw), organised and readable
- [ ] Responsive at 320px → 1920px
- [ ] Clean, consistent design in light and dark mode
- [ ] No sensitive personal info published (site **and** PDF)
- [ ] GitHub repo is public, README included
- [ ] Deployed; GitHub link and live link both work
