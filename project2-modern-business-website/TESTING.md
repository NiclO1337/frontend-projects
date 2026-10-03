# Testing – Bun Intended

[Back to README](README.md)

## Table of contents

* [Manual testing](#manual-testing)
    * [Navigation and links](#navigation-and-links)
    * [Menu filter](#menu-filter)
    * [Open-now badge](#open-now-badge)
    * [Hours table](#hours-table)
    * [Booking form](#booking-form)
* [Responsiveness](#responsiveness)
* [Browser compatibility](#browser-compatibility)
* [Validator testing](#validator-testing)
* [Lighthouse](#lighthouse)
* [Accessibility](#accessibility)
* [Bugs](#bugs)

This project has no automated tests. All testing was done manually.


## Manual testing

### Navigation and links

| Feature | Action | Expected result | Result |
|---------|--------|-----------------|--------|
| Navbar links | Click every link on every page | Correct page opens, active link highlighted | PASS |
| Logo | Click logo | Goes to Home | PASS |
| Book button | Click in navbar and on Home | Opens Book a Table | PASS |
| Mobile menu | Tap the toggle below 992px | Menu opens and closes, links work | PASS |
| Skip link | Press Tab on page load, then Enter | Focus jumps to main content | PASS |
| Footer links | Click Allergens, Book a table, phone, email | Correct page / app opens | PASS |
| Social icons | Click each icon | Opens the platform in a new tab | PASS |
| Carousel | Use arrows and indicators | Slides change, no autoplay | PASS |
| Map | Load Hours & Location | Map shows Götgatan 42 | PASS |
| Logo animation | Load Home | Layers drop in once | PASS |
| Hero logo hover | Hover the big burger on Home, then move away | Top bun lifts and tilts and stays; falls back on mouse out; other layers don't move | PASS |
| Navbar and footer logo hover | Hover or Tab to the logo link | Top bun lifts a few pixels | PASS |
| Reduced motion | Turn on reduced motion in OS, reload | No logo animation | PASS |
| Reduced motion (hover) | Same setting, hover each logo | No lift or tilt | PASS |

### Menu filter

| Action | Expected result | Result |
|--------|-----------------|--------|
| Click "Burgers" | Only Burgers shown, button marked as pressed | PASS |
| Click "All" | Every category shown | PASS |
| Use keyboard only | Buttons reachable and work with Enter/Space | PASS |
| JavaScript disabled | Filter bar hidden, full menu shown | PASS |

### Open-now badge

| Situation (Stockholm time) | Expected text | Result |
|----------------------------|---------------|--------|
| Friday 17:40 | Open now · closes at 23:00 | PASS |
| Saturday 09:25 | Closed · opens today at 12:00 | PASS |
| Friday 23:30 | Closed · opens tomorrow at 12:00 | PASS |
| Friday 23:00 exactly | Closed · opens tomorrow at 12:00 | PASS |

Tip: test other times by temporarily changing the date passed to the helper
in `hours.js`, or by changing the computer's clock.

### Hours table

| Situation | Expected result | Result |
|-----------|-----------------|--------|
| Load Hours & Location | "Monday – Thursday" is split into four rows, 7 rows in total | PASS |
| Any day | Today's row says "Today" and is highlighted, the next day's row says "Tomorrow", the rest keep their day names | PASS |
| Today is Saturday | Saturday row says "Today", Sunday row says "Tomorrow" | PASS |
| Page open past midnight | Labels move to the new today and tomorrow within a minute, and the old rows get their day names back | TODO |
| JavaScript disabled | Four rows with "Monday – Thursday" grouped, no labels | PASS |
| Footer (any page) | Still shows "Monday – Thursday" grouped | PASS |

### Booking form

| Action | Expected result | Result |
|--------|-----------------|--------|
| Submit empty form | Error messages on all required fields | PASS |
| Invalid email | Email error message | PASS |
| Pick a past date | Not possible / error message | PASS |
| Pick a Friday | Time slots 11:00 – 22:00 | PASS |
| Pick a Sunday | Time slots 12:00 – 20:00 | PASS |
| Pick today | Slots that have passed are not shown | PASS |
| Valid submit | Form hidden, confirmation with correct summary, focus on heading | PASS |
| "Make another booking" | Empty form shown again | PASS |


## Responsiveness

Tested with Chrome DevTools and on real devices.

| Width / device | Result |
|----------------|--------|
| 320px (small phone) | PASS |
| 375–390px (phone) | PASS |
| 768px (tablet) | PASS |
| 992px (navbar expands) | PASS |
| 1200px+ (desktop) | PASS |
| Real phone: Galaxy Fold 5 | PASS |

TODO: screenshots


## Browser compatibility

| Browser | Result |
|---------|--------|
| Brave | PASS |
| Chrome | PASS |
| Firefox | PASS |
| Edge | PASS |
| Safari (iOS) | TODO |


## Validator testing

- HTML: [W3C Markup Validator](https://validator.w3.org/) – TODO result for all 6 pages + screenshots
- CSS: [W3C Jigsaw CSS Validator](https://jigsaw.w3.org/css-validator/) – TODO result for `style.css` + screenshot
- JavaScript: [JSHint](https://jshint.com/) – TODO result for each file


## Lighthouse

TODO: mobile and desktop scores per page (Performance, Accessibility, Best Practices, SEO) + screenshots


## Accessibility

- [WAVE](https://wave.webaim.org/) – TODO result per page
- Keyboard-only walkthrough of all pages – TODO
- Colour contrast was checked when planning (all text passes WCAG AA). TODO: confirm with WAVE/DevTools.


## Bugs

### Fixed bugs
- TODO

### Unfixed bugs
- TODO
