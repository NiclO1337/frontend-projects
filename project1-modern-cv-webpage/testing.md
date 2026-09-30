# Testing – Modern CV

[Back to README](README.md)

## Table of contents

* [Manual testing](#manual-testing)
* [Responsiveness](#responsiveness)
* [Browser compatibility](#browser-compatibility)
* [Validator testing](#validator-testing)
* [Lighthouse](#lighthouse)
* [Accessibility](#accessibility)
* [Bugs](#bugs)

This project has no automated tests. All testing was done manually.


## Manual testing

| Feature | Action | Expected result | Result |
|---------|--------|-----------------|--------|
| Theme toggle | Click the moon/sun button | Switches between light and dark mode, icon and label update | PASS |
| Theme memory | Choose dark mode, reload page | Dark mode is still active | PASS |
| System theme | No saved choice, OS set to dark | Site opens in dark mode | PASS |
| Download CV | Click Download CV | PDF downloads, does not contain private contact info | PASS |
| LinkedIn link | Click LinkedIn | Opens LinkedIn profile in new tab | PASS |
| GitHub link | Click GitHub | Opens GitHub profile in new tab | PASS |
| Keyboard | Tab through the page | Every link/button is reachable with a visible focus outline | PASS |
| No false hovers | Hover over headings, photo, skills | Nothing changes, cursor stays default | PASS |


## Responsiveness

Tested with Chrome DevTools and on real devices.

| Width / device | Layout as expected | Result |
|----------------|--------------------|--------|
| 320px (small phone) | One column, no horizontal scroll | PASS |
| 390px (iPhone) | One column | PASS |
| 768px (tablet) | Sidebar sections side by side | PASS |
| 1024px (laptop) | Two-column CV | PASS |
| 1440px+ (desktop) | Two-column CV, card centred | PASS |
| Real phone: Galaxy Fold 5 | | PASS |

TODO: screenshots


## Browser compatibility

| Browser | Result |
|---------|--------|
| Chrome | PASS |
| Firefox | PASS |
| Edge | PASS |
| Brave | PASS |


## Validator testing

- HTML: [W3C Markup Validator](https://validator.w3.org/) – PASSED
<br>![Passed without errors](./readme-assets/w3c-html-result.png)
- CSS: [W3C Jigsaw CSS Validator](https://jigsaw.w3.org/css-validator/) – TODO result + screenshot
<br>The validator reported one false error caused by its outdated CSS support. It was fixed, see [Fixed bugs](#fixed-bugs).


## Lighthouse

TODO: mobile and desktop scores (Performance, Accessibility, Best Practices, SEO) + screenshots


## Accessibility

- [WAVE](https://wave.webaim.org/) – TODO result
- Colour contrast was checked when planning (all text passes WCAG AA). TODO confirm with WAVE/DevTools.


## Bugs

### Fixed bugs
- **CSS validator error caused by an outdated validator.** The W3C Jigsaw validator reported
  `Value Error : width – The types are incompatible` for `.toolbar, .cv`. The line was
  `width: min(1100px, 100% - 2 * var(--space-4));`. This is valid CSS that current browsers
  support, but Jigsaw cannot handle `var()` inside `min()` or `calc()`. Small test snippets
  confirmed this: the validator accepted `min(1100px, calc(100% - 3rem))` and `max-width: 1100px`,
  but rejected every version with `var()` in the calculation. The fix was to remove the
  calculation. The side space now comes from `padding-inline` on `body`, and the toolbar and card
  use `max-width: 1100px` with automatic side margins. The layout looks the same as before.
- TODO: other bugs found during testing

### Unfixed bugs
- TODO
