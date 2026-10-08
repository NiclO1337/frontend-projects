# PROJECT3_CONTEXT – Personal Portfolio Website (React)

Agreed plan for Project 3. It replaces `docs/project3-portfolio-website.md`
and the additional notes: everything that matters is summarised here.

**From the brief:** Build a portfolio you could realistically use as a
professional developer. Focus on quality, structure, usability and
presentation, not unnecessary complexity.

---

## 1. Requirements from the brief (must have)

- [ ] Planned first: target audience, what to showcase, sitemap, wireframes
- [ ] Header/navigation, Home/intro (name, professional title, short
      summary), About, Skills/technologies, Projects, Education/experience,
      Contact, Footer
- [ ] Modern UI/UX: clean, professional, consistent, easy to navigate,
      visually attractive, mobile-friendly
- [ ] Responsive on desktop, tablet and mobile (media queries, flexible
      layouts, responsive images)
- [ ] JavaScript interactivity that improves UX
- [ ] **React:** components, props, state, reusable components,
      **React Router**, lists and conditional rendering, clear folder structure
- [ ] Projects section: name, short description, tech used, screenshot,
      GitHub link, live demo link
- [ ] Public GitHub repo: organised files, README with a clear description
      and technologies used
- [ ] Deployed; live URL works; all links and buttons tested

---

## 2. Agreed decisions

| Topic | Decision |
|-------|----------|
| Repo | Monorepo, folder `project3-portfolio-website/`, `main` only |
| Stack | Vite 8, React 19, JavaScript, React Router v8 (data mode) |
| Start | Fresh `npm create vite@latest` React template, no third-party portfolio template |
| Design | Split layout inspired by **Brittany Chiang's** portfolio + **bento grids** (home, skills) |
| Pages | Home, About, Resume, Projects, Project detail, Contact, 404 |
| Theme | **Deep dark blue** by default + light theme, toggle saved in `localStorage` |
| Effects | Light-blue neon: cursor trail (canvas), custom cursor, glow hovers, page/scroll animations (**Motion**) |
| Effects toggle | Next to the theme toggle. Effects are also off with reduced motion and on touch devices |
| Project filter | Single-select tech chips + "All", stored in the URL (`/projects?tech=react`) |
| Contact | Validated form that really sends through **Web3Forms** |
| Extras | Download CV (PDF from Project 1). GitHub API stats panel = stretch goal |
| Styling | **CSS Modules** + global token file |
| Icons | `react-icons` (Font Awesome + Simple Icons for tech logos) |
| Fonts | Space Grotesk (headings), Inter (body), JetBrains Mono (labels/code accents) via Fontsource |
| Testing | Vitest + React Testing Library + jsdom; unit tests per component, integration tests at the end, no coverage target |
| Quality | ESLint (from template) + Prettier |
| Deployment | Vercel, Root Directory = `project3-portfolio-website`, SPA rewrite in `vercel.json` |
| Docs | Same README template as before, `TESTING.md`, `readme-assets/` |

---

## 3. Audience and goals

**Target audience**
1. **Recruiters and hiring managers** for junior developer roles in
   Stockholm/remote. They skim for 30–60 seconds: who, what stack, proof of
   work, how to get in touch.
2. **Tech leads / developers** reviewing a candidate. They open project
   details, GitHub links and code quality.
3. **Teachers** grading the course project.

**What to showcase:** full-stack range (Python/Django → JavaScript/React →
C#/.NET in progress), 8 real projects with live demos, 10+ years of
work experience (customer service, project coordination, design), and
attention to UX, accessibility and testing.

**Goals:** visitors should understand Niclas in 10 seconds, find a relevant
project in 2 clicks, and be able to contact him or download the CV from any page.

---

## 4. Sitemap and routes

```
/                      Home           bento grid intro
/about                 About          bio + skills bento
/resume                Resume         experience + education timelines, Download CV
/projects              Projects       filter chips + project cards   (?tech=react)
/projects/:slug        Project detail one project, prev/next links
/contact               Contact        form + direct links
*                      404            "Lost in the void" + links home
```

`src/routes.jsx` (sketch – check v8 docs for exact APIs):
```jsx
export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,           // unexpected crashes only
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "resume", element: <ResumePage /> },
      { path: "projects", element: <ProjectsPage /> },
      {
        path: "projects/:slug",
        element: <ProjectDetailPage />,
        loader: projectLoader,
        errorElement: <NotFoundPage />,    // renders inside RootLayout's <Outlet />
      },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
// main.jsx: createBrowserRouter(routes)   tests: createMemoryRouter(routes, { initialEntries: ["/projects"] })
```
- `projectLoader` looks up the slug with `getProjectBySlug()` and throws a
  404 if the slug is unknown. Because the `errorElement` sits on the child
  route, the "not found" page renders inside the normal layout (sidebar
  stays).
- `ErrorPage` is a small standalone page ("Something went wrong" + link
  home) for unexpected errors anywhere in the app.
- `NavLink` gives `aria-current="page"` and an active class automatically.
- **On route change:** scroll to top, and move focus to the page `<h1>`
  (`tabIndex={-1}`) so screen readers announce the new page. Keep this
  in one small `useRouteFocus` hook in `RootLayout`.

See `readme-assets/sitemap.svg`.

---

## 5. Layout

### Desktop (≥ 1024px): split layout (Chiang-style)
- **Left column** (sticky, full height, ~40% width, max 480px):
  - Name (styled like a logo, *not* the page `<h1>`), professional title,
    one-line tagline
  - Vertical nav: About · Resume · Projects · Contact. The active link has a
    line indicator that grows (Chiang style) and glows neon
  - Bottom: social icons (GitHub, LinkedIn, Email), **theme toggle** and
    **effects toggle** side by side
- **Right column** (scrolls): the current page in `<main>`, footer at the bottom.

### Tablet and mobile (< 1024px)
- Top bar: name (link home), menu button (`aria-expanded`, `aria-controls`).
- Menu: full-screen overlay with nav links, toggles and social icons. It
  closes on link click, on Escape and on route change. Focus goes to the
  first link when it opens and back to the button when it closes. Page
  scroll is locked while it's open.
- Content in one column. Bento grids drop to 2 columns (tablet) / 1 column (mobile).

### Breakpoints
`768px` (tablet: 2-column grids) and `1024px` (split layout). Adjust at the end.

---

## 6. Pages and content

Base content comes from Project 1 (`project1-modern-cv-webpage/index.html`).
It's copied into `src/data/` files, so components only render data.

### Home – bento grid
Grid of tiles (4 columns desktop, 2 tablet, 1 mobile). Tiles have
different spans for the bento look:

| Tile | Content | Span (desktop) |
|------|---------|----------------|
| Intro | `<h1>` "Hi, I'm Niclas", title *Junior Fullstack Software Developer*, summary (2 lines), buttons **View projects** + **Contact me** | 2 × 2 |
| Photo | Profile photo with neon ring (placeholder first) | 1 × 2 |
| Now | "Currently: Full Stack C# .NET at Lexicon (2026)" | 1 × 1 |
| Tech stack | Row of tech icons (slow infinite marquee, pauses on hover and when effects are off) | 2 × 1 |
| Featured project | Latest/featured project card with screenshot → detail page | 2 × 1 |
| Location & languages | Stockholm, Sweden · Swedish (native) · English (fluent) | 1 × 1 |
| Download CV | Big icon button tile | 1 × 1 |

### About
- `<h1>` About me: the 3 paragraphs from Project 1 (building practical
  apps, 10 years of back-office experience, hobbies).
- **Skills bento:** one tile per group, with icons:
  Technologies (HTML5, CSS3, JavaScript, Python, TypeScript, C#) ·
  Frameworks (Django, Bootstrap, Tailwind, React, Next.js, ASP.NET,
  Entity Framework) · Databases (PostgreSQL, SQL Server) ·
  Version control (Git, GitHub) · Agile (Scrum, Kanban) ·
  Tools (VS Code, Visual Studio, PyCharm, Balsamiq, Lucidchart, Miro) ·
  AI tools (GitHub Copilot, Claude Code, ChatGPT).
- Skills are plain items with icons, **not** progress bars (percentages say
  little about real skill level).

### Resume
- `<h1>` Resume + **Download CV** button (`public/cv/niclas-hugdahl-cv.pdf`, `download` attribute).
- **Experience timeline** (date column left, content right on desktop, Chiang style):
  - Receptionist & Fullstack Developer – Hotel Copenhagen ApS, 2024–2025
  - Procurement & Project Coordinator – Rodemreklam AB, 2013–2024
- **Education timeline:**
  - Full Stack C# .NET Web Development with AI-powered development – Lexicon, 2026–ongoing
  - Diploma in Fullstack Software Development (30 ECTS) – Code Institute, 2023–2024 (Distinction)
  - Science Program – Jensen Gymnasium, 2005–2007
- Bullet text exactly as in Project 1.

### Projects
- `<h1>` Projects + short intro.
- **Filter:** chips built from the projects' `tech` lists (unique, sorted
  by how often they're used) + "All". Single-select. The selection lives
  in the URL via `useSearchParams` (`?tech=python`), so it survives
  refresh and back/forward and can be shared. Show "Showing 3 of 8 projects"
  in an `aria-live="polite"` region.
- **Grid** of `ProjectCard`s (3 / 2 / 1 columns): screenshot, title, year
  + type label, short description, tech tags, links (Live ↗, GitHub ↗) and
  a "Details" link to `/projects/:slug`.
- Card hover: neon border glow + a soft **spotlight** that follows the mouse
  inside the card (CSS radial gradient positioned with CSS variables set
  in `onPointerMove`). It's cheap and looks great.

### Project detail – `/projects/:slug`
- Back link "← All projects" (keeps the active filter if there was one).
- `<h1>`, meta row (year · type · role), large screenshot, 1–2 paragraph
  description, "Highlights" list, tech list, buttons **Live demo ↗** and
  **Source code ↗**.
- Prev / next project navigation at the bottom.

### Contact
- `<h1>` Let's talk + one friendly sentence.
- Form: name, email, message (all required), hidden honeypot `botcheck`.
- Validation on blur and submit, with messages under the fields
  (`aria-describedby`, `aria-invalid`).
- States: `idle → sending → success | error`, kept as a single `status`
  state (not several booleans). The button shows "Sending…" and is disabled
  while sending. On success the form is replaced by a thank-you message. On
  error there's a message + mailto fallback.
- Sends a `POST` to `https://api.web3forms.com/submit` with `access_key`
  from `import.meta.env.VITE_WEB3FORMS_KEY`. Add the key to `.env` locally
  and to Vercel env vars. The key is public by design, but keep it out of
  the repo anyway.
- Side links: LinkedIn, GitHub. No phone number, no real email address shown
  (privacy rule from Project 1).

### 404
- "404 – Lost in the void" with a neon-glitch heading, links to Home and Projects.

### Footer (bottom of the content column)
"Designed & built by Niclas Hugdahl · React + Vite · © {current year}" +
social icons (on mobile only, since desktop has them in the sidebar).

---

## 7. Data model

`src/data/projects.js` (one object per project; images imported from `src/assets/projects/`):
```js
{
  slug: "banana-palace",
  title: "Banana Palace",
  year: 2024,
  type: "Code Institute – Portfolio Project 4",
  featured: true,
  summary: "One sentence for the card.",
  description: ["Paragraph 1", "Paragraph 2"],
  highlights: ["User accounts with Allauth", "..."],
  tech: ["Python", "Django", "JavaScript", "Bootstrap", "PostgreSQL"],
  image: bananaPalaceImg,
  imageAlt: "Banana Palace website shown on several devices",
  liveUrl: "https://…",     // optional: leave out if not deployed
  repoUrl: "https://github.com/NiclO1337/pp4-banana-palace",  // optional: leave out if private
}
```
Helpers in `src/utils/projects.js` (pure functions, easy to unit test):
`getProjectBySlug(slug)`, `getTechList(projects)`,
`filterProjectsByTech(projects, tech)`, `getAdjacentProjects(slug)`.
Tech slugs for the URL: lowercase, spaces → dashes (`"Next.js"` → `next-js`).
Write a `toSlug()` helper for this.

### The 8 projects (newest first)

| Slug | Title | Year | Type | Tech | Live | Repo |
|------|-------|------|------|------|------|------|
| `bun-intended` | Bun Intended | 2026 | Lexicon – Project 2 | HTML, CSS, Bootstrap, JavaScript | https://frontend-projects-project2-modern-b.vercel.app/ | https://github.com/NiclO1337/frontend-projects/tree/main/project2-modern-business-website |
| `modern-cv` | Modern CV | 2026 | Lexicon – Project 1 | HTML, CSS, JavaScript | https://frontend-projects-project1-modern-c.vercel.app/ | https://github.com/NiclO1337/frontend-projects/tree/main/project1-modern-cv-webpage |
| `weightlifting-calculator` | Weightlifting Calculator | 2025 | Personal project | React, JavaScript, Vite, Vitest, PWA | https://niclo1337.github.io/weightlifting-calculator | https://github.com/NiclO1337/weightlifting-calculator |
| `purrfect-paws-predictor` | Purrfect Paws Predictor | 2024 | Code Institute – PP5 | Python, TensorFlow, Streamlit, Pandas, Jupyter | https://purrfect-paws-predictor-ab2bd8b45a44.herokuapp.com/ | https://github.com/NiclO1337/pp5-cats-vs-dogs |
| `banana-palace` | Banana Palace | 2024 | Code Institute – PP4 | Python, Django, JavaScript, Bootstrap, PostgreSQL | https://banana-palace-9ad263ab8cf3.herokuapp.com/ | https://github.com/NiclO1337/pp4-banana-palace |
| `dream-achiever` | Dream Achiever | 2023 | Code Institute – PP3 | Python | https://dream-achiever-3a6af54c4f68.herokuapp.com/ | https://github.com/NiclO1337/pp3-dream-achiever |
| `rps-battle-arena` | RPS Battle Arena | 2023 | Code Institute – PP2 | HTML, CSS, JavaScript | https://niclo1337.github.io/pp2-playtime/ | https://github.com/NiclO1337/pp2-playtime |
| `strawberry-lovers` | Strawberry Lovers | 2023 | Code Institute – PP1 | HTML, CSS | https://niclo1337.github.io/pp1-strawberry-lovers/index.html | https://github.com/NiclO1337/pp1-strawberry-lovers |

Short summaries (from each README; polish in step 15):
- **Bun Intended:** Multi-page website for a fictional Stockholm burger
  restaurant with a dark "ketchup & mustard" theme, menu filter, live
  open-now badge and a validated booking form.
- **Modern CV:** One-page responsive CV in the style of a modern Canva
  template, with dark mode and a PDF download.
- **Weightlifting Calculator:** Calculates training weights from a 1RM,
  shows which plates to load, and has a "Free Calc" bar builder. Settings
  are saved locally and it can be installed as a PWA.
- **Purrfect Paws Predictor:** A convolutional neural network trained on
  25,000 images to tell cats from dogs, with a Streamlit dashboard for the
  data study and live predictions. *Be honest in the description: the
  README notes that the deployed model struggles with live images.*
- **Banana Palace:** Full-stack Django restaurant site with user accounts,
  table reservations (create/edit/cancel), menu and discounts. Planned
  with agile user stories on GitHub Projects.
- **Dream Achiever:** Python command-line budget calculator that works out
  how long it takes to reach a savings goal and gives money-saving tips.
- **RPS Battle Arena:** Rock-paper-scissors game in JavaScript against the
  character Arnold, with score tracking and smooth screen transitions.
- **Strawberry Lovers:** Static multi-page community site about growing
  strawberries, with recipes, a gallery and a sign-up form.

**Screenshots:** download the "Am I Responsive" images linked in each
README (Cloudinary/`docs` folders), resize to ~1200px wide, convert to
WebP and save in `src/assets/projects/`. Projects 1 and 2: take new screenshots.

### Other data files
- `profile.js`: name, title, tagline, summary, about paragraphs, location,
  languages, social links (GitHub `https://github.com/NiclO1337`,
  LinkedIn `https://www.linkedin.com/in/niclas-hugdahl`), CV path.
- `skills.js`: groups → items `{ name, icon }`.
- `experience.js`, `education.js`: `{ id, title, organisation, location, start, end, bullets[] }`.

---

## 8. Component structure

```
src/
├── main.jsx                 createBrowserRouter(routes) + providers
├── routes.jsx               the route config (shared with tests)
├── styles/  tokens.css · global.css
├── context/ ThemeContext.js · ThemeProvider.jsx · EffectsContext.js · EffectsProvider.jsx
│            (context + useX hook in the .js file, the provider component in the .jsx file)
├── hooks/   useLocalStorage.js · useMediaQuery.js · useRouteFocus.js
├── layouts/ RootLayout/           sidebar + main + footer + effects
├── pages/   HomePage/ AboutPage/ ResumePage/ ProjectsPage/
│            ProjectDetailPage/ ContactPage/ NotFoundPage/ ErrorPage/
├── components/
│   ├── Sidebar/  MobileHeader/  MobileMenu/  NavMenu/  SocialLinks/  Footer/
│   ├── ThemeToggle/  EffectsToggle/  SkipLink/
│   ├── Button/            variants: primary | ghost; renders <a>, <Link> or <button>
│   ├── BentoGrid/ BentoTile/
│   ├── SkillGroup/  Timeline/ TimelineItem/
│   ├── ProjectCard/  ProjectFilter/  TechTag/
│   ├── ContactForm/
│   └── Reveal/            scroll-reveal wrapper (Motion whileInView)
├── effects/ CursorTrail/  CustomCursor/
├── data/    profile.js · skills.js · experience.js · education.js · projects.js
├── utils/   projects.js · toSlug.js
├── assets/  images/ · projects/
└── test/    setup.js · renderWithRouter.jsx · integration/
```
Each component folder: `Name.jsx`, `Name.module.css`, `Name.test.jsx`.

**Reusable components show the brief's React concepts:**
- props: `Button`, `TechTag`, `BentoTile`, `TimelineItem`, `ProjectCard`
- state: `ProjectFilter` (URL state), `ContactForm`, `MobileMenu`
- context: `ThemeContext`, `EffectsContext`
- custom hooks: `useLocalStorage`, `useMediaQuery`, `useRouteFocus`
- lists: projects, skills, timelines, nav links
- conditional rendering: form status, empty filter result, effects on/off, 404

---

## 9. Design system

### Colours (`src/styles/tokens.css`)

Set by `data-theme` on `<html>`. A tiny inline script in `index.html`
sets the saved theme **before** React loads, so the page doesn't flash
the wrong theme. All text pairs were checked: WCAG AA (4.5:1), and UI
borders meet 3:1.

| Token | Dark (default) | Light | Notes |
|-------|----------------|-------|-------|
| `--color-bg` | `#060d1f` | `#f3f7ff` | Deep dark blue |
| `--color-surface` | `#0b1630` | `#ffffff` | Tiles, cards, sidebar panels |
| `--color-surface-2` | `#112042` | `#e6eefc` | Inputs, chips, raised areas |
| `--color-text` | `#dbe7ff` | `#0b1630` | 15.6 / 16.7 on bg |
| `--color-text-muted` | `#8fa3c7` | `#46597d` | 7.6 / 6.6 on bg |
| `--color-accent` | `#5ce1ff` | `#0369a1` | **Neon light blue**. Links, active nav, focus |
| `--color-on-accent` | `#060d1f` | `#ffffff` | Text on accent buttons (12.6 / 5.9) |
| `--color-accent-2` | `#a99bff` | `#5b43d6` | Soft violet, gradients and secondary tags only |
| `--color-border` | `#1d2d52` | `#d3def2` | Decorative borders |
| `--color-input-border` | `#4f6a99` | `#7d90b3` | Form controls (≥ 3:1) |
| `--glow-sm` | `0 0 8px rgb(92 225 255 / .45)` | `0 0 6px rgb(3 105 161 / .25)` | Hover glow |
| `--glow-lg` | `0 0 24px rgb(92 225 255 / .35), 0 0 2px #5ce1ff` | `0 4px 18px rgb(3 105 161 / .18)` | Cards, active elements |

> The bright light-mode blue `#0077b6` was rejected: only 4.2–4.5:1. In
> light mode the "neon" is toned down to soft blue shadows. The trail
> and cursor use `--color-accent`.

### Typography (Fontsource, self-hosted, so no Google Fonts request)
`@fontsource-variable/space-grotesk`, `@fontsource-variable/inter`,
`@fontsource-variable/jetbrains-mono`, imported in `global.css`.

| Use | Font | Size |
|-----|------|------|
| Page `<h1>` | Space Grotesk 700 | `clamp(2.25rem, 1.6rem + 3vw, 4rem)` |
| `<h2>` | Space Grotesk 600 | `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` |
| Body | Inter 400 | `1rem / 1.65`, max ~68ch |
| Labels, dates, tags, nav numbers ("01."), years | JetBrains Mono 500 | `0.8125rem`, accent colour |

### Spacing and shape
`--space-1 … --space-8` (0.25 → 6rem, plus the half-step `--space-2-5` = 0.75rem), `--radius-sm: 6px`,
`--radius: 14px` (bento tiles/cards), `--radius-pill: 999px`,
`--sidebar-width: min(40vw, 480px)`, `--content-max: 760px`,
`--transition: 200ms ease`.

---

## 10. Effects (all light-blue neon)

`EffectsContext` provides `effectsOn`. It's **true** only when all of these hold:
the user toggle is on (default on, saved in `localStorage`),
`prefers-reduced-motion` is not `reduce`, and the device has a mouse
(`(hover: hover) and (pointer: fine)`). This applies to **every** effect,
including the Motion animations, as the project `CLAUDE.md` requires.
The context also gives `effectsAvailable` (the last two conditions) and
`effectsEnabled` (the visitor's own choice). `EffectsToggle` renders nothing
when effects are not available, since it would change nothing.

| Effect | How | Off when effects off? |
|--------|-----|-----------------------|
| **Cursor trail** | `CursorTrail`: fixed full-screen `<canvas>` (`pointer-events: none`). Keep the last ~24 pointer positions with timestamps. Each frame, draw a fading line: one wide low-alpha stroke + one thin bright stroke (no `shadowBlur`). Stop the rAF loop when there are no points left. Cap the canvas resolution at `devicePixelRatio` 2. Resize on window resize | Yes (unmounted) |
| **Custom cursor** | `CustomCursor`: small neon dot exactly at the pointer + a ring that follows with a Motion spring. The ring grows over `a, button, [role=button], label` (event delegation with `closest()`). The native cursor is hidden with a body class, **except** in text inputs, which keep the normal I-beam | Yes (unmounted, native cursor back) |
| **Neon hovers** | CSS only: `box-shadow: var(--glow-sm)`, border colour → accent, text-shadow on nav links. Same styles on `:focus-visible` | No (static, cheap) |
| **Card spotlight** | Radial gradient at `--x/--y` inside the card, updated in `onPointerMove` | Spotlight off |
| **Page enter** | `motion.div` keyed by `location.pathname`: fade + 12px slide up, 250ms. **Enter only, no exit animation** (exit + Outlet adds complexity we don't need) | Yes |
| **Scroll reveal** | `<Reveal>` wrapper: `whileInView`, `viewport={{ once: true, amount: 0.2 }}` | Yes |
| **Tech marquee** | CSS keyframes on the Home tile, paused on hover | Paused |
| **Nav indicator** | Line grows from 32px → 64px on active/hover (CSS transition) | No |

Wrap the app in `<MotionConfig reducedMotion={effectsOn ? "user" : "always"}>`.
Then **one switch controls every Motion animation**.

Toggles (sidebar bottom + mobile menu), both `<button aria-pressed>`:
- Theme: sun/moon icon, constant label "Dark mode", `aria-pressed` = dark theme on
- Effects: sparkles icon, constant label "Effects", `aria-pressed` = effects on
- The label stays the same and only `aria-pressed` changes. A label that
  changes too would be announced as a contradiction ("Switch to light mode, pressed").

---

## 11. Testing plan

Setup (step 3): `vitest` + `@testing-library/react` +
`@testing-library/user-event` + `@testing-library/jest-dom` + `jsdom`.
In `vite.config.js`: `test: { environment: "jsdom", globals: true, setupFiles: "./src/test/setup.js" }`.

`src/test/setup.js`:
- `import "@testing-library/jest-dom/vitest"`
- Mock `window.matchMedia` (jsdom doesn't have it). Default: no fine
  pointer → cursor effects don't render in tests.
- Mock `IntersectionObserver` (Motion `whileInView` needs it).
- `afterEach`: clear `localStorage`, restore mocks.

`src/test/renderWithRouter.jsx`: renders `createMemoryRouter(routes, { initialEntries })`
inside the providers. Used by page and integration tests.

**Unit tests (written with each component):**
| Target | What we test |
|--------|--------------|
| `utils/projects.js`, `toSlug` | slug lookup, unknown slug, tech list unique + sorted, filtering, prev/next wrap-around |
| `useLocalStorage` | reads initial value, writes on change, bad JSON falls back to default |
| `ThemeToggle` | toggles `data-theme`, `aria-pressed` updates, saved to storage |
| `EffectsToggle` | toggles context value, `aria-pressed` updates |
| `NavMenu` | renders all links, active link has `aria-current="page"` |
| `MobileMenu` | opens/closes, `aria-expanded`, Escape closes, link click closes |
| `Button` | renders `<a>` / `Link` / `<button>` depending on props; external links get `target` + `rel` |
| `ProjectCard` | title, tags, image alt, link hrefs |
| `ProjectFilter` | chips from data, selecting sets `aria-pressed`, calls `onChange` |
| `Timeline` | renders entries in order with `<time>` |
| `ContactForm` | required errors, invalid email, success message with mocked `fetch`, error state on failed `fetch` |
| `NotFoundPage` | heading + links |

**Integration tests (end of project, `src/test/integration/`):**
1. Navigation: click every nav link → right `<h1>`, active link updates, focus moves to `<h1>`
2. Projects flow: filter "Python" → URL has `?tech=python`, 3 cards shown → open a card → detail page → "All projects" goes back with the filter still active
3. Deep links: `/projects/banana-palace` renders directly. `/projects/nope` → not-found message
4. Unknown route → 404 page
5. Theme + effects toggles persist across navigation
6. Contact: fill and submit → mocked `fetch` called with the right body → success message

---

## 12. Packages

```
npm create vite@latest . -- --template react         # step 1
npm i react-router motion react-icons
npm i @fontsource-variable/space-grotesk @fontsource-variable/inter @fontsource-variable/jetbrains-mono
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npm i -D prettier eslint-config-prettier
```
Requires **Node ≥ 22.22** (React Router v8). Check with `node -v`.
Scripts to add: `"test": "vitest"`, `"test:run": "vitest run"`,
`"format": "prettier --write ."`.

---

## 13. Build plan (one step = one commit, tests in the same commit)

**Phase 0 – Setup**
| # | Step | Commit |
|---|------|--------|
| 1 | Scaffold in this folder: `npm create vite@latest . -- --template react`, choose **"Ignore files and continue"**, answer **No** to "install and start now". Then `git checkout -- README.md` to restore our README. Check that the generated `.gitignore` covers `node_modules` and `dist` | `project-3: scaffold vite react app` |
| 2 | Remove demo code, add Prettier + scripts, create the folder structure | `project-3: clean up template` |
| 3 | Vitest setup + one smoke test | `project-3: set up vitest` |
| 4 | `vercel.json` SPA rewrite, first deploy (deploy early) | `project-3: add vercel config` |

**Phase 1 – Foundation**
| # | Step | Commit |
|---|------|--------|
| 5 | Fonts, `tokens.css` (both themes), `global.css` | `project-3: add design tokens` |
| 6 | `routes.jsx`, `RootLayout`, placeholder pages, 404 | `project-3: add routing` |
| 7 | Sidebar + NavMenu (desktop) | `project-3: add sidebar navigation` |
| 8 | MobileHeader + MobileMenu | `project-3: add mobile menu` |
| 9 | Footer, SkipLink, `useRouteFocus`, page titles | `project-3: add footer and route focus` |
| 10 | `useLocalStorage`, ThemeContext, ThemeToggle, no-flash script | `project-3: add theme toggle` |

**Phase 2 – Content**
| # | Step | Commit |
|---|------|--------|
| 11 | `profile.js`, `skills.js`, `experience.js`, `education.js` from Project 1 | `project-3: add profile data` |
| 12 | `Button`, `BentoGrid`, `BentoTile` + Home page | `project-3: add home bento grid` |
| 13 | About page + `SkillGroup` bento | `project-3: add about page` |
| 14 | `Timeline` + Resume page + Download CV | `project-3: add resume page` |
| 15 | `projects.js` data + screenshots (WebP) | `project-3: add projects data` |
| 16 | `TechTag`, `ProjectCard`, Projects grid | `project-3: add project cards` |
| 17 | Utils + `ProjectFilter` + `useSearchParams` | `project-3: add project filter` |
| 18 | Project detail page, loader, not-found, prev/next | `project-3: add project detail page` |
| 19 | `ContactForm` UI + validation | `project-3: add contact form` |
| 20 | Web3Forms sending + status states, `.env.example` | `project-3: send contact form` |

**Phase 3 – Effects**
| # | Step | Commit |
|---|------|--------|
| 21 | `useMediaQuery`, EffectsContext, EffectsToggle, MotionConfig | `project-3: add effects toggle` |
| 22 | Neon hover/focus styles + card spotlight | `project-3: add neon hover effects` |
| 23 | Page enter animation + `Reveal` | `project-3: add page animations` |
| 24 | `CursorTrail` | `project-3: add cursor trail` |
| 25 | `CustomCursor` | `project-3: add custom cursor` |
| 26 | Performance check with CPU throttling, fixes | `project-3: optimize effects` |

**Phase 4 – Quality and docs**
| # | Step | Commit |
|---|------|--------|
| 27 | Integration tests: navigation, 404, deep links | `project-3: add navigation tests` |
| 28 | Integration tests: projects flow | `project-3: add projects flow tests` |
| 29 | Integration tests: toggles + contact | `project-3: add toggle and contact tests` |
| 30 | Responsive pass at 375 / 768 / 1024 / 1440px | `project-3: refine responsive layout` |
| 31 | Lighthouse, WAVE, keyboard test, fixes | `project-3: fix accessibility issues` |
| 32 | Screenshots, finish README + TESTING.md | `project-3: update readme` |
| ★ | Stretch: GitHub stats tile (public repos, top languages via GitHub REST API, cached in `sessionStorage`) | `project-3: add github stats` |

---

## 14. Deployment (Vercel)

1. Vercel → Add New → Project → import `NiclO1337/frontend-projects` (third
   Vercel project).
2. **Root Directory:** `project3-portfolio-website`.
3. Framework Preset: **Vite** (auto-detected). Build `npm run build`,
   output `dist`.
4. Settings → Build and Deployment → **Node.js Version: 24.x** (React
   Router v8 needs ≥ 22.22).
5. Settings → Build and Deployment → **Ignored Build Step**:<br>
   Behaviour: `Only build if there are changes in a folder`<br>
   Command: `git diff HEAD^ HEAD --quiet -- .`<br>
   (so pushes to other projects don't redeploy this one).
6. Settings → Environment Variables: `VITE_WEB3FORMS_KEY`.
7. `vercel.json` in the project folder, so refreshing `/projects` doesn't 404:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

---

## 15. Accessibility checklist

- Skip link → `<main id="main">`. Landmarks: `header`/`nav`/`main`/`footer`
- One `<h1>` per page. Focus moves to it on route change. Unique `<title>` per page
- Nav uses `NavLink` (`aria-current="page"`)
- Mobile menu: `aria-expanded`, `aria-controls`, Escape closes, focus managed
- Toggles are `<button aria-pressed>` with clear labels
- Filter chips: `<button aria-pressed>` in a labelled group, plus a live
  result count
- External links say they open in a new tab (visually hidden text or icon with label)
- Images have meaningful `alt`. Decorative icons get `aria-hidden`
- Form: labels, `aria-invalid`, `aria-describedby` errors, status messages in `role="status"`
- Visible neon `:focus-visible` ring everywhere
- Effects off with reduced motion, plus a manual toggle
- Contrast AA in both themes

---

## 16. Definition of done

- [ ] All 7 routes work, including refresh and deep links on Vercel
- [ ] Mandatory sections present (intro, about, skills, projects, education/experience, contact, nav, footer)
- [ ] Filter works and is stored in the URL. Detail pages for all 8 projects
- [ ] Contact form really sends; error state tested
- [ ] Dark/light theme and effects toggle work and persist
- [ ] Effects run smoothly with 4× CPU throttling; off on touch and with reduced motion
- [ ] Unit + integration tests pass (`npm run test:run`), lint clean
- [ ] Responsive at mobile, tablet, desktop. Lighthouse and WAVE checked
- [ ] All links and buttons tested; no broken images
- [ ] README + TESTING.md complete; repo public; live URL works
