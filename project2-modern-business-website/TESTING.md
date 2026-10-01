# Testing – Bun Intended

[Back to README](README.md)

## Table of contents

* [Manual testing](#manual-testing)
    * [Navigation and links](#navigation-and-links)
    * [Menu filter](#menu-filter)
    * [Open-now badge](#open-now-badge)
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
| Navbar links | Click every link on every page | Correct page opens, active link highlighted | TODO |
| Logo | Click logo | Goes to Home | TODO |
| Book button | Click in navbar and on Home | Opens Book a Table | TODO |
| Mobile menu | Tap the toggle below 992px | Menu opens and closes, links work | TODO |
| Skip link | Press Tab on page load, then Enter | Focus jumps to main content | TODO |
| Footer links | Click Allergens, Book a table, phone, email | Correct page / app opens | TODO |
| Social icons | Click each icon | Opens the platform in a new tab | TODO |
| Carousel | Use arrows and indicators | Slides change, no autoplay | TODO |
| Map | Load Hours & Location | Map shows Götgatan 42 | TODO |
| Logo animation | Load Home | Layers drop in once | TODO |
| Reduced motion | Turn on reduced motion in OS, reload | No logo animation | TODO |

### Menu filter

| Action | Expected result | Result |
|--------|-----------------|--------|
| Click "Burgers" | Only Burgers shown, button marked as pressed | TODO |
| Click "All" | Every category shown | TODO |
| Use keyboard only | Buttons reachable and work with Enter/Space | TODO |
| JavaScript disabled | Filter bar hidden, full menu shown | TODO |

### Open-now badge

| Situation (Stockholm time) | Expected text | Result |
|----------------------------|---------------|--------|
| Monday 14:00 | Open now · closes at 22:00 | TODO |
| Monday 09:00 | Closed · opens today at 11:00 | TODO |
| Friday 23:30 | Closed · opens tomorrow at 12:00 | TODO |
| Sunday 21:00 exactly | Closed · opens tomorrow at 11:00 | TODO |

Tip: test other times by temporarily changing the date passed to the helper
in `hours.js`, or by changing the computer's clock.

### Booking form

| Action | Expected result | Result |
|--------|-----------------|--------|
| Submit empty form | Error messages on all required fields | TODO |
| Invalid email | Email error message | TODO |
| Pick a past date | Not possible / error message | TODO |
| Pick a Friday | Time slots 11:00 – 22:00 | TODO |
| Pick a Sunday | Time slots 12:00 – 20:00 | TODO |
| Pick today | Slots that have passed are not shown | TODO |
| Valid submit | Form hidden, confirmation with correct summary, focus on heading | TODO |
| "Make another booking" | Empty form shown again | TODO |


## Responsiveness

Tested with Chrome DevTools and on real devices.

| Width / device | Result |
|----------------|--------|
| 320px (small phone) | TODO |
| 375–390px (phone) | TODO |
| 768px (tablet) | TODO |
| 992px (navbar expands) | TODO |
| 1200px+ (desktop) | TODO |
| Real phone: TODO | TODO |

TODO: screenshots


## Browser compatibility

| Browser | Result |
|---------|--------|
| Chrome | TODO |
| Firefox | TODO |
| Edge | TODO |
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
