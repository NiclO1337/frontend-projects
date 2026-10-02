# PROJECT2_CONTEXT – Bun Intended (Modern Business Website)

Agreed plan for Project 2. It replaces `docs/project2-modern-business-website.md`:
everything from the school brief that matters is summarised here.

**From the brief:** Modern • Clean • Responsive • Consistent • User-friendly.
A small but professional business website, not a huge application.

---

## 1. Requirements from the brief (must have)

- [ ] Business defined: name, type, target customers, main products
- [ ] Planned first: sitemap, page layout sketches, colour + typography style
- [ ] HTML5 with semantic elements; multiple pages
- [ ] CSS3 in an external stylesheet; Flexbox and/or Grid; consistent spacing
      and typography (Bootstrap is allowed)
- [ ] Responsive on **desktop, tablet and mobile**: media queries, flexible
      layouts, responsive images
- [ ] **At least one meaningful JavaScript interaction** that improves UX
- [ ] Public GitHub repo with organised folders, README and a clear description
- [ ] Deployed with a working live URL
- [ ] Navigation works, all links and buttons tested, no broken images or links

Submission: GitHub repository URL + live website URL.

---

## 2. Agreed decisions

| Topic | Decision |
|-------|----------|
| Repo | Monorepo `NiclO1337/frontend-projects`, folder `project2-modern-business-website/`, `main` only |
| Deployment | Vercel, Root Directory = `project2-modern-business-website` |
| Business | **Bun Intended**: fictional burger restaurant in Stockholm |
| Tech | HTML5, Bootstrap 5.3 (CDN), custom CSS, vanilla JS. No Sass, no build tools |
| Theme | **Dark only** ("ketchup & mustard"). No light mode, no toggle |
| Pages | Home, Menu, Our Story, Hours & Location, Book a Table, Allergens |
| Logo | Animated SVG hamburger + "Bun Intended" in Merienda |
| Favicon | The hamburger (SVG) + PNG fallback |
| Fonts | Merienda (headings, special texts), M PLUS Rounded 1c (buttons and links), Noto Sans (body text) |
| Icons | Font Awesome Free (cdnjs) |
| Own JavaScript | Menu category filter, open-now badge, booking form validation |
| Slider | Bootstrap carousel on the home page |
| Map | Google Maps `<iframe>` embed (no API key) |
| Images | Free photos from Pexels/Unsplash, resized, WebP, credited in README |
| Breakpoints | Bootstrap's: 576 / 768 / 992 / 1200px. Navbar collapses below 992px |
| Header/footer | Copied into every page (kept in sync manually) |
| Hover effects | Links and buttons only |
| Folders | HTML pages at the top level; `assets/css/`, `assets/js/`, `assets/images/` |
| README | Same template structure as Project 1, with `TESTING.md` and `readme-assets/` |
| Testing | Manual only |

---

## 3. The business

| | |
|---|---|
| **Name** | Bun Intended |
| **Type** | Burger restaurant: "smash burgers, seriously good puns". More upscale than fast food (table service, craft beer, made from scratch) but relaxed, not fancy |
| **Tagline** | *Smash burgers. Seriously good puns.* |
| **Location** | Götgatan 42, 118 26 Stockholm (Södermalm), near T-bana Medborgarplatsen |
| **Target customers** | Locals and visitors aged 20–45: friends after work, couples on a casual date night, small groups celebrating. People who care about good ingredients and don't want fine dining |
| **Main products** | Smash burgers (beef, chicken, plant-based), sides, milkshakes, craft beer |
| **Tone of voice** | Warm, confident, playful. One pun per section is enough. The food descriptions stay appetising and clear |

**Placeholder contact info** (all fictional):
- Phone: `+46 8 000 00 00`
- Email: `hello@bunintended.example`
- Social: Instagram, Facebook, TikTok, linking to the platforms' home pages

**Opening hours:**

| Day | Hours |
|-----|-------|
| Monday – Thursday | 11:00 – 22:00 |
| Friday | 11:00 – 23:00 |
| Saturday | 12:00 – 23:00 |
| Sunday | 12:00 – 21:00 |

---

## 4. Sitemap

```
Home (index.html)
├── Menu (menu.html) ──────────────► Allergens (allergens.html)
├── Our Story (our-story.html)
├── Hours & Location (hours-location.html)
└── Book a Table (book.html)     ← button in navbar, CTA on Home

Footer (every page): address, phone, email, social links,
                     info links → Allergens, Book a Table
```

Navbar: logo (link to home) · Menu · Our Story · Hours & Location ·
**[Book a table]** (styled as a button). On mobile the links collapse
into a hamburger toggle. That's Bootstrap's own JS, not ours.

See `readme-assets/sitemap.svg` and `readme-assets/wireframes/`.

---

## 5. Pages and content

### Shared on every page
- `<header>` with Bootstrap navbar (`navbar-expand-lg`, sticky top),
  inline SVG logo + "Bun Intended", nav links, Book button.
- Active page: `class="nav-link active" aria-current="page"`.
- `<main id="main">` + a "Skip to content" link as the first focusable element.
- `<footer>`: three columns on desktop, stacked on mobile:
  1. Logo, tagline, address (`<address>`), phone, email
  2. Opening hours (short version) and "Info" links: Allergens, Book a table
  3. Social icons (with `aria-label`), © year

### Home – `index.html`
1. **Hero:** big animated burger logo, `<h1>Bun Intended</h1>`, tagline,
   two buttons: *See the menu* (primary), *Book a table* (outline).
2. **Image slider:** Bootstrap carousel, 4 slides (signature burger, dining
   room, fries & shakes, friends at a table), short captions, indicators and
   prev/next controls. **No autoplay**, because moving content without a
   pause button is an accessibility problem. Captions: "Lettuce begin.",
   "A bun-derful place to be.", "Fry-day feeling, any day.", "Good friends.
   Relish the moment." Caption, dots and arrows are smaller on phones.
3. **Welcome:** 2 short paragraphs + photo (two columns from `lg`).
4. **CTA band:** "Hungry yet?" + *Book a table* button. Placed here, above
   the featured dishes, so it doesn't blend into the footer. This differs
   from the home wireframe on purpose.
5. **Featured dishes:** 3 cards (image, name, short description, price),
   1 → 3 columns. "See full menu" button.

### Menu – `menu.html`
- Intro text + filter bar: **All · Starters · Burgers · Sides · Desserts · Drinks**
- One `<section data-category="…">` per category with an `<h2>`, then a
  list of items. Each item shows: name (Merienda), short description, price
  in SEK, diet labels **V** (vegetarian), **VG** (vegan) and **GF**
  (gluten-free), each with an `<abbr title="…">`.
- Note under the menu: "All burgers come with fries. Gluten-free bun
  +15 kr. Allergies? See our allergen guide" (link).
- Two columns of items from `lg`, one column below.

Starter menu content (Claude Code may polish the wording):

| Category | Item | Description | Price | Labels |
|----------|------|-------------|-------|--------|
| Starters | Onion Rings of Power | Beer-battered onion rings, chipotle mayo | 79 kr | V |
| Starters | Wings, No Strings | Crispy chicken wings, hot honey glaze | 109 kr | |
| Starters | Halloumi Fries | Fried halloumi, pomegranate, mint yoghurt | 95 kr | V |
| Burgers | The Classic Pun | Double smashed beef, cheddar, pickles, onion, house sauce | 169 kr | |
| Burgers | Brie-lieve It | Beef, brie, fig jam, rocket | 189 kr | |
| Burgers | Smoke Me If You Can | Beef, smoked bacon, onion rings, smoked cheddar, BBQ sauce | 195 kr | |
| Burgers | Hot Mess | Buttermilk fried chicken, hot honey, slaw | 179 kr | |
| Burgers | Kale Me Maybe | Plant-based patty, vegan cheese, avocado, kale | 175 kr | VG |
| Burgers | Mush Ado About Nothing | Portobello, halloumi, truffle mayo | 169 kr | V |
| Sides | Fries | Skin-on fries, sea salt | 45 kr | VG, GF |
| Sides | Sweet Potato Fries | With smoked paprika mayo | 55 kr | V, GF |
| Sides | Truffle Parm Fries | Truffle oil, parmesan, parsley | 69 kr | V, GF |
| Sides | Slaw | Crunchy cabbage slaw, lime dressing | 39 kr | VG, GF |
| Desserts | Shake It Off | Thick vanilla, chocolate or strawberry milkshake | 79 kr | V, GF |
| Desserts | Brownie Points | Warm chocolate brownie with walnuts, vanilla ice cream | 89 kr | V |
| Drinks | Södermalm Pale Ale | Local craft beer, 40 cl | 89 kr | VG |
| Drinks | House Lemonade | Lemon, ginger or raspberry | 49 kr | VG, GF |
| Drinks | Soft Drinks | Coca-Cola, Fanta, Sprite | 35 kr | VG, GF |

Featured on Home: The Classic Pun, Kale Me Maybe, Shake It Off.

### Our Story – `our-story.html`
- Intro: two friends, Elin and Jonas (fictional), who thought burgers
  deserved better ingredients and that puns deserved a restaurant.
- **Timeline** (vertical, alternating sides from `lg`):
  - 2016: Food truck at Stockholm street-food markets
  - 2018: Win a local street-food competition with The Classic Pun
  - 2020: Open the restaurant on Götgatan
  - 2024: Renovation, a bar with local craft beer
  - Today: Still smashing, still punning
- **What we stand for:** 3 value cards with icons: Swedish beef from local
  farms · Buns baked fresh every morning · Puns served free of charge.
- 1–2 photos.

### Hours & Location – `hours-location.html`
- `<h1>` + **open-now badge** (JS, see §7).
- Hours table (`<table>` with `<caption>`; each row has `data-day`).
- Address card: address, phone, email, "Getting here" (T-bana
  Medborgarplatsen, 5 min walk; bus 3 and 4), *Book a table* button.
- Google Maps embed: `<iframe src="https://www.google.com/maps?q=Götgatan+42,+118+26+Stockholm&output=embed" title="Map showing Bun Intended at Götgatan 42, Stockholm" loading="lazy" referrerpolicy="no-referrer-when-downgrade">`, responsive with Bootstrap's `.ratio .ratio-16x9`.
- 2–3 photos of the restaurant (grid).

### Book a Table – `book.html`
- Form (left / top) + info card (right / below): "Groups larger than 8? Call us",
  short hours list, cancellation note.
- Fields: name*, email*, phone (optional), date*, time* (`<select>`),
  guests* (`<select>` 1–8), message (optional, max 300 characters).
- Behaviour: see §7. **Nothing is sent.** The confirmation says it's a demo.

### Allergens – `allergens.html`
- Short intro: "Tell your server about allergies. We'll help you choose."
- Responsive table (`.table-responsive`): rows = menu items, columns =
  Gluten · Milk · Egg · Mustard · Sesame · Soy · Nuts, ✓ where present
  (with visually hidden text "contains" for screen readers).
- Note on the gluten-free bun and shared fryers.

---

## 6. Design system

### Colours (dark only)

Defined as custom properties in `:root`, and mapped onto Bootstrap
variables. All text pairs meet WCAG AA, and UI borders meet 3:1.

| Token | Value | Used for |
|-------|-------|----------|
| `--bi-bg` | `#141111` | Page background (charcoal) |
| `--bi-surface` | `#1f1a18` | Cards, navbar, footer |
| `--bi-surface-2` | `#2a2320` | Inputs, table stripes, raised areas |
| `--bi-surface-3` | `#352d29` | Lightest surface: the light end of the header and footer gradients (muted text on it 5.9:1) |
| `--bi-scrim` | `rgba(20, 17, 17, 0.8)` | See-through dark layer behind captions and controls on photos |
| `--bi-text` | `#f5efe6` | Body text (warm cream), 16.4:1 on bg |
| `--bi-text-muted` | `#b8aa9a` | Descriptions, captions, 7.6:1 on surface |
| `--bi-mustard` | `#f2b705` | Headings, prices, links, focus ring, 10.3:1 on bg |
| `--bi-on-mustard` | `#141111` | Text on mustard backgrounds |
| `--bi-ketchup` | `#e63b2e` | **Brand red**: logo, decorative lines, large text only (4.5:1 on bg) |
| `--bi-ketchup-dark` | `#c8281c` | Primary button background (white text 5.6:1) |
| `--bi-ketchup-darker` | `#a91f15` | Primary button hover/active (7.3:1) |
| `--bi-ketchup-light` | `#ff6b5e` | Red *text* on dark, e.g. error messages (6.7:1 on bg) |
| `--bi-lettuce` | `#7cc35a` | Diet labels, success messages (8.1:1 on surface), logo lettuce |
| `--bi-white` | `#fff` | Text on the red primary button |
| `--bi-bun`, `--bi-patty` | `#e0a75e`, `#5a2e1c` | Logo bun and patty (cheese, lettuce and seeds reuse other tokens) |
| `--bi-border` | `#3d332e` | Decorative dividers only |
| `--bi-input-border` | `#8c7b6e` | Form control borders (3.8:1, meets the 3:1 UI rule) |

> ⚠️ `#e63b2e` with white text is only 4.2:1, which **fails** AA for
> button text. Buttons therefore use `--bi-ketchup-dark`.

Bootstrap mapping (in `style.css`, after Bootstrap):
```css
:root,
[data-bs-theme="dark"] {
  --bs-body-bg: var(--bi-bg);
  --bs-body-color: var(--bi-text);
  --bs-secondary-color: var(--bi-text-muted);
  --bs-border-color: var(--bi-border);
  --bs-link-color-rgb: 242, 183, 5;        /* mustard */
  --bs-link-hover-color-rgb: 255, 214, 92;
  --bs-body-font-family: "Noto Sans", system-ui, sans-serif;
}
.btn-primary {
  --bs-btn-bg: var(--bi-ketchup-dark);
  --bs-btn-border-color: var(--bi-ketchup-dark);
  --bs-btn-hover-bg: var(--bi-ketchup-darker);
  --bs-btn-hover-border-color: var(--bi-ketchup-darker);
  --bs-btn-active-bg: var(--bi-ketchup-darker);
  --bs-btn-color: #fff;
}
```
Secondary button: `.btn-outline-warning` re-tinted to mustard
(text mustard, hover = mustard background + charcoal text).

> ⚠️ Some Bootstrap classes read a separate `-rgb` variable, not the plain
> one. `.bg-body-secondary` uses `--bs-secondary-bg-rgb`, so mapping only
> `--bs-secondary-bg` leaves Bootstrap's own blue-grey. That is why
> `--bi-surface-rgb` and `--bi-surface-2-rgb` exist and are mapped onto
> `--bs-secondary-bg-rgb` and `--bs-tertiary-bg-rgb`.
>
> Bootstrap 5.3 also turns carousel captions, dots and arrows black in dark
> mode. `style.css` overrides these with the same selectors, placed later.

### Typography

Google Fonts (one `<link>` with `preconnect`, `display=swap`):
`Merienda:wght@400;700`, `M PLUS Rounded 1c:wght@500;700`, `Noto Sans:wght@400;600`.

| Element | Font | Notes |
|---------|------|-------|
| Body text | Noto Sans 400 | 1rem / 1.6 |
| `h1`–`h3`, logo text, prices, taglines | Merienda 700 | `h1` cream, `h2` mustard |
| Nav links, buttons, filter buttons, badges, footer links | M PLUS Rounded 1c 500/700 | |
| Small text, captions | Noto Sans 400 | muted colour |

### Shapes and spacing
- Use Bootstrap spacing utilities (`py-5`, `gap-3`, …) for spacing.
- Radius: `--bs-border-radius: 0.75rem` (friendly, rounded "bun" feel).
  Buttons are pill-shaped (set once on `.btn` in `style.css`, so no
  `rounded-pill` class is needed in the HTML).
- Header and footer have a diagonal gradient (`to bottom right`) built from
  the surface tokens: the header goes from `--bi-surface` to
  `--bi-surface-3`, the footer the other way round.
- Page background: a faint repeating food pattern on `<main>` (cream at 3%
  opacity). It is the "I Love Food" pattern by Steve Schoger from Hero
  Patterns (CC BY 4.0), credited in the README and in `style.css`. The
  navbar, footer and cards stay solid.
- Photos: `img-fluid`, `object-fit: cover`, fixed aspect ratios
  (`.ratio` or `aspect-ratio`), `width`/`height` attributes,
  `loading="lazy"` on everything except the first slide.
- Section separators: a thin ketchup line or a wavy "sauce drip" SVG
  divider (optional, only if time allows).

### The animated logo
- An inline SVG burger made of 5 layers, each a `<g>` with a class:
  `bun-top` (with sesame seeds), `lettuce`, `cheese`, `patty`, `bun-bottom`.
  Colours: bun `#e0a75e`, lettuce `#7cc35a`, cheese `#f2b705`,
  patty `#5a2e1c`, tomato/ketchup `#e63b2e`.
- **Hero (home):** the layers drop in one by one on page load (staggered
  `animation-delay`) and land with a small squash. Runs once.
- **Navbar:** small static burger. When the logo link is hovered or
  focused, the top bun lifts a few pixels (CSS `transition`).
- Inline SVGs get `aria-hidden="true"` because the text "Bun Intended"
  next to them is the accessible name.
- `@media (prefers-reduced-motion: reduce)`: no drop-in, no lift.
- **Favicon:** `assets/images/favicon.svg`. If it's animated, it must
  rest on the complete burger, because Chrome and Safari only show the
  first frame and don't animate favicons. Also add
  `apple-touch-icon.png` (180×180) as a fallback.

---

## 7. JavaScript features (our own code)

All scripts are plain `<script defer>` files, loaded only on pages that need
them. Without JS everything still shows and works, just without the extras
(progressive enhancement).

### `hours.js` (shared data + helpers)
```js
// Keys match Date.getDay(): 0 = Sunday … 6 = Saturday
const OPENING_HOURS = {
  0: { open: "12:00", close: "21:00" },
  1: { open: "11:00", close: "22:00" },
  2: { open: "11:00", close: "22:00" },
  3: { open: "11:00", close: "22:00" },
  4: { open: "11:00", close: "22:00" },
  5: { open: "11:00", close: "23:00" },
  6: { open: "12:00", close: "23:00" },
};
```
Helpers: `toMinutes("11:30")`, `getStockholmNow()` (day + minutes, using
`Intl.DateTimeFormat` with `timeZone: "Europe/Stockholm"`, so the result
is correct for visitors in other time zones), `isOpen(day, minutes)`.

### 1. Open-now badge – `open-status.js` (Hours & Location)
- Shows one of the following:
  - 🟢 **Open now** · closes at 22:00
  - 🔴 **Closed** · opens today at 11:00
  - 🔴 **Closed** · opens tomorrow at 12:00
- Text + colour + icon, so colour is never the only signal.
- Badge has `role="status"`. It refreshes every minute (`setInterval`).
- Optional: highlight today's row in the hours table.

### 2. Menu filter – `menu-filter.js` (Menu)
- The filter bar has the `hidden` attribute in the HTML, and JS removes it.
  Visitors without JS just see the full menu, not buttons that don't work.
- Buttons: `<button type="button" data-filter="burgers" aria-pressed="false">`
  inside a `role="group"` with `aria-label="Filter menu by category"`.
- Clicking a button sets `hidden` on the category sections that don't
  match, updates `aria-pressed`, and updates a visually hidden
  `aria-live="polite"` message ("Showing: Burgers").
- "All" shows every section.

### 3. Booking form – `booking-form.js` (Book a Table)
- `<form novalidate>` + Bootstrap validation styles
  (`.was-validated`, `.invalid-feedback` texts written for humans).
- Uses the Constraint Validation API: `checkValidity()`,
  `setCustomValidity()`.
- **Date:** `min` = today and `max` = today + 60 days (set by JS).
  Error if the date is in the past.
- **Time:** when a date is chosen, JS rebuilds the time `<select>` with
  30-minute slots from opening time until **1 hour before closing**,
  based on that weekday in `OPENING_HOURS`. Slots that have already
  passed today are left out. Before a date is chosen, the select is
  disabled with the text "Choose a date first".
- **Guests:** 1–8. The info card says to call for bigger groups.
- **On valid submit:** `preventDefault()`, hide the form, show a
  confirmation card: *"Thanks, Anna! Your request for 4 guests on Friday
  3 October at 19:00 is noted."* plus *"This is a demo site – no booking
  was sent."* Move focus to the confirmation heading (`tabindex="-1"`).
  A *Make another booking* button resets the form.

---

## 8. Accessibility checklist

- `lang="en"`, unique `<title>` and meta description per page
- Skip link, landmarks (`header`/`nav`/`main`/`footer`), one `<h1>` per page,
  no skipped heading levels
- Navbar toggler has `aria-label`, `aria-controls` and `aria-expanded`
  (Bootstrap provides these when the markup is right)
- `aria-current="page"` on the active nav link
- Every image has meaningful `alt` text (or `alt=""` if decorative)
- Icon-only links (social) have an `aria-label`. Decorative icons get `aria-hidden="true"`
- Form fields have visible `<label>`s. Errors are linked to their fields and
  written clearly
- Visible focus ring (mustard) on all interactive elements
- Carousel doesn't autoplay. Controls have labels
- Map iframe has a `title`
- All animations respect `prefers-reduced-motion`
- Test: keyboard only, WAVE, Lighthouse

---

## 9. Folder structure

```
project2-modern-business-website/
├── CLAUDE.md
├── PROJECT2_CONTEXT.md
├── README.md
├── TESTING.md
├── index.html
├── menu.html
├── our-story.html
├── hours-location.html
├── book.html
├── allergens.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── hours.js
│   │   ├── open-status.js
│   │   ├── menu-filter.js
│   │   └── booking-form.js
│   └── images/
│       ├── favicon.svg
│       ├── apple-touch-icon.png
│       ├── slider-1.webp … slider-4.webp   (~1600px wide)
│       ├── dish-*.webp                     (~800px wide)
│       ├── story-*.webp
│       └── location-*.webp
└── readme-assets/
    ├── sitemap.svg
    ├── colour-scheme.svg
    ├── wireframes/
    └── screenshots/      (at the end)
```

---

## 10. Build plan (one step = one commit)

| # | Step | Suggested commit |
|---|------|------------------|
| 1 | `index.html` boilerplate: meta, Bootstrap CSS+JS, fonts, Font Awesome, `style.css`, `data-bs-theme="dark"` | `project-2: add html boilerplate` |
| 2 | Colour tokens, Bootstrap overrides, typography | `project-2: add base styles` |
| 3 | Navbar + footer on Home (skip link, active state, Book button) | `project-2: add navbar and footer` |
| 4 | Burger logo SVG in navbar + hover lift | `project-2: add burger logo` |
| 5 | Home hero + logo drop-in animation (+ reduced motion) | `project-2: add home hero` |
| 6 | Find, resize and convert photos to WebP | `project-2: add images` |
| 7 | Carousel with 4 slides | `project-2: add image slider` |
| 8 | Welcome section, featured dishes, CTA band | `project-2: add home content` |
| 9 | Create the 5 other pages from the Home template (head, navbar, footer, active link) | `project-2: add page templates` |
| 10 | Menu page content | `project-2: add menu content` |
| 11 | Menu filter (`menu-filter.js`) | `project-2: add menu filter` |
| 12 | Allergens page | `project-2: add allergens page` |
| 13 | Our Story page (timeline, values) | `project-2: add our story page` |
| 14 | Hours & Location: table, address card, map, photos | `project-2: add hours and location` |
| 15 | `hours.js` + open-now badge | `project-2: add open now badge` |
| 16 | Booking form markup + info card | `project-2: add booking form` |
| 17 | Booking validation, time slots, confirmation | `project-2: add booking validation` |
| 18 | Favicon + apple-touch-icon on all pages | `project-2: add favicon` |
| 19 | Deploy to Vercel, add live URL | `project-2: add live url` |
| 20 | Responsive pass: every page at 375 / 768 / 1024 / 1440px | `project-2: refine responsive layout` |
| 21 | W3C, Jigsaw, Lighthouse, WAVE + fixes | `project-2: fix validation issues` |
| 22 | Screenshots, finish README + TESTING.md | `project-2: update readme` |

---

## 11. Deployment (Vercel)

1. Vercel → Add New → Project → import `NiclO1337/frontend-projects` (again,
   as a second Vercel project).
2. **Root Directory:** `project2-modern-business-website`.
3. Framework Preset: **Other**, no build command.
4. Deploy, then add the live URL to the README.
5. Settings → Build and Deployment → **Ignored Build Step** set: <br>
Behaviour: `Only build if there are changes in a folder`<br>Command: `git diff HEAD^ HEAD --quiet -- .`<br>
   (so pushes to other projects don't redeploy this one).

---

## 12. Definition of done (brief's final checklist)

- [ ] Business idea and target users defined (README + §3)
- [ ] Sitemap and layout planned (readme-assets)
- [ ] All 6 pages built with semantic HTML5
- [ ] CSS complete, consistent across pages
- [ ] Responsive on mobile, tablet and desktop
- [ ] JS: menu filter, open-now badge and booking validation work
- [ ] Navigation works on all pages (desktop + mobile toggle)
- [ ] All links and buttons tested; no broken images or links
- [ ] HTML/CSS validate; Lighthouse and WAVE checked
- [ ] Repo public, README included, deployed, live URL works
