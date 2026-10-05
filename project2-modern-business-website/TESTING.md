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
- **Guests select failed W3C HTML validation** (`book.html`): the validator reported that the first option of a `<select required>` must have an empty value or no text. The guests select always has a value (2 guests is preselected and cannot be cleared), so `required` did nothing. Fixed by removing the `required` attribute. The `*` stays in the label because the field is still mandatory in practice.
- **Slider text and controls were black** (`style.css`): in dark mode Bootstrap 5.3 makes the carousel "dark", with black captions, black dots and inverted arrows, which are unreadable on our dark caption pills. Fixed by overriding those rules with the same selectors, placed after Bootstrap's CSS.
- **Burger logo had a gap between the cheese and the patty** (all pages and `favicon.svg`): the cheese ended one SVG unit above the patty, which left a thin line of background showing. Fixed by changing the cheese path so it touches the patty.
- **Map showed an empty white box without JavaScript** (`hours-location.html`): Google's embedded map needs JavaScript to draw itself. Fixed by hiding the map in the HTML, revealing it with `map.js`, and showing a `<noscript>` link to Google Maps instead.
- **Footer logo lifted when hovering the text** (`style.css`): the top bun reacted to hover on the whole "Bun Intended" name in the footer, which broke the rule that hover effects are only for links, buttons and the burger itself. Fixed by tying the hover effect to `.logo-burger` instead of `.brand-name`.
- **Hero logo hover was instant and too strong** (`style.css`): the small-logo hover rules also matched the big hero logo (both have the class `logo-burger`) and replaced its own transition, so the top bun jumped instead of moving smoothly. Fixed by excluding `.hero-logo` from those rules, and by making the hero effect slower (0.35s) and gentler (lift 16 units, tilt 13°).
- **Timeline dots sat too high** (`style.css`): the dots were not aligned with the year text next to them. Fixed by moving them down (`top: 0.4rem`).

### Unfixed bugs
- None known
