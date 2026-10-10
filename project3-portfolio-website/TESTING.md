# Testing – Developer Portfolio

[Back to README](README.md)

## Table of contents

* [Automated testing](#automated-testing)
    * [Setup](#setup)
    * [Unit tests](#unit-tests)
    * [Integration tests](#integration-tests)
    * [Test results](#test-results)
* [Manual testing](#manual-testing)
    * [Navigation and links](#navigation-and-links)
    * [Projects filter](#projects-filter)
    * [Contact form](#contact-form)
    * [Theme and effects](#theme-and-effects)
* [Responsiveness](#responsiveness)
* [Browser compatibility](#browser-compatibility)
* [Performance](#performance)
* [Validator testing](#validator-testing)
* [Lighthouse](#lighthouse)
* [Accessibility](#accessibility)
* [Bugs](#bugs)


## Automated testing

### Setup

Tests are written with [Vitest](https://vitest.dev/) and
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
in a jsdom environment. Each component's test file sits next to the
component. Integration tests are in `src/test/integration/`, and they
render the real route configuration with a memory router.

```bash
npm test           # watch mode
npm run test:run   # run once
```

### Unit tests

| File | What is tested | Result |
|------|----------------|--------|
| `utils/projects.test.js` | slug lookup, tech list, filtering, prev/next | TODO |
| `hooks/useLocalStorage.test.js` | read, write, invalid JSON fallback | TODO |
| `ThemeToggle.test.jsx` | toggles theme, label, `aria-pressed`, saved | TODO |
| `EffectsToggle.test.jsx` | toggles effects, label | TODO |
| `NavMenu.test.jsx` | links, active link | TODO |
| `MobileMenu.test.jsx` | open/close, Escape, `aria-expanded` | TODO |
| `Button.test.jsx` | element type, external link attributes | TODO |
| `ProjectCard.test.jsx` | content, image alt, links | TODO |
| `ProjectFilter.test.jsx` | chips, selection, `aria-pressed` | TODO |
| `Timeline.test.jsx` | entries and dates | TODO |
| `ContactForm.test.jsx` | validation, success, error | TODO |
| `NotFoundPage.test.jsx` | heading and links | TODO |
| TODO: add the rest | | |

### Integration tests

| Flow | Expected result | Result |
|------|-----------------|--------|
| Click every nav link | Right page heading, active link updates, focus on heading | TODO |
| Filter projects by Python | URL has `?tech=python`, only Python projects shown | TODO |
| Open a project from the filtered list and go back | Detail page shown; going back keeps the filter | TODO |
| Open `/projects/banana-palace` directly | Detail page renders | TODO |
| Open `/projects/unknown` | "Project not found" inside the layout | TODO |
| Open an unknown route | 404 page | TODO |
| Toggle theme and effects, then navigate | Settings stay the same | TODO |
| Submit the contact form (mocked fetch) | Correct request body, success message | TODO |

### Test results

TODO: screenshot of `npm run test:run` output


## Manual testing

### Navigation and links

| Feature | Action | Expected result | Result |
|---------|--------|-----------------|--------|
| Sidebar nav | Click each link (desktop) | Correct page, active indicator | TODO |
| Mobile menu | Open, click link, Escape | Menu works and closes | TODO |
| Skip link | Tab on load, Enter | Focus jumps to main content | TODO |
| Refresh on sub-page | Refresh `/projects` on live site | Page loads (no Vercel 404) | TODO |
| Project links | Click Live and GitHub on every project | Correct site opens in a new tab | TODO |
| Download CV | Click the button on Home and Resume | PDF downloads | TODO |
| Social links | Click GitHub and LinkedIn | Correct profiles open | TODO |

### Projects filter

| Action | Expected result | Result |
|--------|-----------------|--------|
| Click a tech chip | Only matching projects, count updates | TODO |
| Click "All" | All projects shown, `?tech` removed from URL | TODO |
| Browser back after filtering | Previous filter restored | TODO |
| Open `/projects?tech=react` directly | React filter active | TODO |

### Contact form

| Action | Expected result | Result |
|--------|-----------------|--------|
| Submit empty | Errors on all fields | TODO |
| Invalid email | Email error | TODO |
| Valid submit (live site) | Success message, email received | TODO |
| Offline submit | Error message with fallback | TODO |

### Theme and effects

| Action | Expected result | Result |
|--------|-----------------|--------|
| Toggle theme, reload | Theme remembered, no flash of wrong theme | TODO |
| Toggle effects off | Trail, custom cursor and animations stop | TODO |
| OS reduced motion on | Effects off automatically | TODO |
| Touch device | No trail or custom cursor | TODO |


## Responsiveness

| Width / device | Result |
|----------------|--------|
| 320px | PASS |
| 375–390px (phone) | PASS |
| 768px (tablet) | PASS |
| 1024px (split layout starts) | PASS |
| 1440px+ | PASS |
| Real phone: Samsung Galaxy Fold 5 | PASS |


## Browser compatibility

| Browser | Result |
|---------|--------|
| Brave | TODO |
| Chrome | TODO |
| Firefox | TODO |
| Edge | TODO |


## Performance

Effects were checked in Chrome DevTools → Performance with 4× CPU throttling,
on the production build (`npm run build` and `npm run preview`) in an
Incognito window.

| Check | Result |
|-------|--------|
| Cursor trail and custom cursor, normal and fast mouse movement | Smooth |
| Spotlight on the bento tiles, normal movement | Smooth |
| Spotlight on the project cards | Still laggy when moving fast across several cards at 4×, so it was removed from the cards |

What changed because of the testing:
- The canvas has one pixel per CSS pixel, so it has 4 to 9 times fewer pixels to draw on sharp screens.
- The spotlight has no `will-change` and no fade, because its own layer inside a rounded `overflow: hidden` tile lagged.
- The spotlight was removed from the project cards. Removing their glow transition instead changed little, so the glow stayed.
- Drawing the trail in batched fade levels was tried and reverted: it was not smoother and looked jagged.

TODO: screenshot of a Performance recording


## Validator testing

- HTML: [W3C Markup Validator](https://validator.w3.org/) on the built pages – TODO
- CSS: [W3C Jigsaw](https://jigsaw.w3.org/css-validator/) – TODO (CSS Modules output in `dist/`)
- ESLint: `npm run lint` with no errors – TODO


## Lighthouse

TODO: mobile and desktop scores + screenshots


## Accessibility

### WAVE

[WAVE](https://wave.webaim.org/) was run on every page. WAVE sorts its findings into errors (real
failures) and alerts (things a human should check). Errors must be 0. Each alert was checked by hand.

![WAVE result](./readme-assets/wave-result.png)

| Page | Errors | Contrast errors | Alerts | AIM score |
|------|:------:|:---------------:|:------:|:---------:|
| Home | 0 | 0 | 4 (3 after fix) | 10 |
| About | 0 | 0 | 2 | 10 |
| Resume | 0 | 0 | 3 | 10 |
| Projects | 0 | 0 | 10 | 9.8 |
| Projects detail | 0 | 0 | 2 | 10 |
| Contact | 1 (0 after fix) | 0 | 2 | 10 |
| NotFound | 0 | 0 | 2 | 10 |
| Error | 0 | 0 | 1 | 10 |
| Error (no JS) | 0 | 0 | 0 | 10 |

The WAVE extension does not run with JavaScript turned off. The "JavaScript is required" message was therefore tested as a separate HTML file with the same content, without the `<noscript>` wrapper. The `<noscript>` alert itself is listed under "All pages" below.

**Errors**

| Page | Error | Count | Where | Decision |
|------|-------|:-----:|-------|----------|
| Contact | Missing form label | 1 | Hidden spam-trap checkbox above "Send message" | Fixed: the checkbox is hidden from everyone (`display: none`, `aria-hidden`), but WAVE still reports an input without a label. It now has an `aria-label`. |

**Alerts**

Two alerts appear on every page, because they come from the shared layout and `index.html`. They are listed once here, not once per page. The Error page is the exception for the redundant link: it does not use the shared layout, so it only has the Noscript alert.

| Page | Alert | Count | Where | Decision |
|------|-------|:-----:|-------|----------|
| All pages | Redundant link | 1 | Name link to the home page in the sidebar | Left as is: Home is not in the menu, so the name is the only way back to the home page. Linking the name or logo to home is a common pattern, and removing or disabling the link on the home page would only make the page less predictable. |
| All pages | Noscript element | 1 | `<noscript>` in `index.html` | Left as is: it is the "JavaScript is required" message for visitors with JavaScript turned off. Without it they would see an empty page, because React builds everything in the browser using JavaScript. |
| Home | Long alternative text | 1 | Featured project image | Fixed: the alt text was over 100 characters. All project alt texts are now 100 characters or less (for example "Bun Intended website on a monitor, laptop, tablet and phone, showing the Our Story page"), and a data test fails if a new one is longer. |
| Home, Resume | Link to PDF document | 1 per page | "Download CV" | Left as is: the link text already says it is a file download, which is what the alert asks for. WAVE cannot check the PDF itself. The CV is a tagged PDF with real text, exported from Word. |
| Projects | Redundant link | 8 | The title link on each project card | Left as is: each card links to its details page from the image, the title and the "Details" button. The image link is hidden from screen readers and the Tab key, so only the title and the button are left. The title is the heading, and the button gives a clear action with its own name ("Details of …"). |

### Keyboard-only walkthrough

Every page was tested with Tab, Shift+Tab, Enter, Space and Esc only.

| Check | Result |
|-------|--------|
| Skip link appears on first Tab and jumps to main content | TODO |
| Focus order follows the visual order on all pages | TODO |
| Neon focus ring visible on every link, button and field | TODO |
| No keyboard traps | TODO |
|  |  |

### Colour contrast

All text pairs were calculated when planning (all pass WCAG AA). WAVE then confirmed it with 0 contrast errors on every page.

## Bugs

### Fixed bugs
- Cursor trail drawn to the left of the pointer on pages with a scrollbar: the canvas was sized with `100%`, which leaves out the scrollbar, while its pixel size used the full window width. Fixed by sizing it with `100vw` / `100vh`.
- Cursor trail kept the old colour after the theme changed while the mouse was moving: the colour was only read when a new trail started. Now it is read every frame.
- Cursor trail showed darker "beads" at every mouse position: round line ends overlapped and a see-through stroke painted twice looks darker. Fixed with flat glow ends and an opaque core line.
- Cursor trail looked harsh in light mode: it now has its own lighter `--color-cursor` colour.
- Lag when moving fast over bento tiles and project cards with 4× CPU throttling: see the Performance section.
- Autofilled contact form fields got the browser's own background and text colour instead of the theme colours: browsers ignore `background` for autofill. Fixed by painting over it with a large inset `box-shadow` in `--color-surface-2`, setting `-webkit-text-fill-color`, and adding the neon focus glow back to the same `box-shadow` on `:focus-visible`.
- TODO: add bugs found in later steps

### Unfixed bugs
- TODO
