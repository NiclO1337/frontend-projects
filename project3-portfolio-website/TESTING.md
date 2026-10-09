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
| 320px | TODO |
| 375–390px (phone) | TODO |
| 768px (tablet) | TODO |
| 1024px (split layout starts) | TODO |
| 1440px+ | TODO |
| Real phone: Samsung Galaxy Fold 5 | TODO |


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

- [WAVE](https://wave.webaim.org/) per page – TODO
- Keyboard-only walkthrough – TODO
- Screen reader check of route changes – TODO


## Bugs

### Fixed bugs
- Cursor trail drawn to the left of the pointer on pages with a scrollbar: the canvas was sized with `100%`, which leaves out the scrollbar, while its pixel size used the full window width. Fixed by sizing it with `100vw` / `100vh`.
- Cursor trail kept the old colour after the theme changed while the mouse was moving: the colour was only read when a new trail started. Now it is read every frame.
- Cursor trail showed darker "beads" at every mouse position: round line ends overlapped and a see-through stroke painted twice looks darker. Fixed with flat glow ends and an opaque core line.
- Cursor trail looked harsh in light mode: it now has its own lighter `--color-cursor` colour.
- Lag when moving fast over bento tiles and project cards with 4× CPU throttling: see the Performance section.
- TODO: add bugs found in later steps

### Unfixed bugs
- TODO
