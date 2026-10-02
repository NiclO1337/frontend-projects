/* jshint esversion: 6 */

// Menu category filter (menu.html)
// Clicking a category button hides the other category sections.
// Without JavaScript the filter bar stays hidden and the whole menu is shown.

const filterBar = document.querySelector("#menu-filter");
const filterButtons = filterBar.querySelectorAll("button");
const menuSections = document.querySelectorAll("[data-category]");
const filterStatus = document.querySelector("#menu-filter-status");

// Data attributes: HTML like data-category="burgers" is read in JS as
// element.dataset.category. This is how a button and a section are matched.
function showCategory(category, label) {
  menuSections.forEach(function (section) {
    // The hidden property is the same as the hidden attribute in the HTML
    section.hidden = category !== "all" && section.dataset.category !== category;
  });

  // aria-pressed tells screen readers which button is selected.
  // The CSS turns the same attribute into the mustard fill.
  filterButtons.forEach(function (button) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === category));
  });

  // Changing this text makes screen readers say it out loud (aria-live)
  filterStatus.textContent = "Showing: " + label;
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showCategory(button.dataset.filter, button.textContent);
  });
});

// JavaScript works, so the buttons can be shown
filterBar.hidden = false;
