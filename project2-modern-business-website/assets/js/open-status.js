/* jshint esversion: 6 */
/* global OPENING_HOURS, toMinutes, getStockholmNow, isOpen */

// Open-now badge and "today" highlight (hours-location.html)
// Needs hours.js to be loaded first.

const badge = document.querySelector("#open-status");
const hoursRows = document.querySelectorAll("[data-day]");

// Works out what the badge should say. Every day has opening hours, so
// "tomorrow" always has an opening time.
function getOpenStatus(day, minutes) {
  const today = OPENING_HOURS[day];

  if (isOpen(day, minutes)) {
    return { open: true, text: "Open now · closes at " + today.close };
  }

  if (minutes < toMinutes(today.open)) {
    return { open: false, text: "Closed · opens today at " + today.open };
  }

  const tomorrow = OPENING_HOURS[(day + 1) % 7];
  return { open: false, text: "Closed · opens tomorrow at " + tomorrow.open };
}

function showStatus(status) {
  // The badge has role="status", so screen readers read out every change.
  // Skip the update when nothing changed, otherwise it would be read out
  // again every minute.
  if (badge.dataset.status === status.text) {
    return;
  }
  badge.dataset.status = status.text;

  // Icon + text + colour, so colour is never the only signal
  const icon = document.createElement("i");
  icon.className = "fa-solid " + (status.open ? "fa-circle-check" : "fa-circle-xmark");
  icon.setAttribute("aria-hidden", "true");

  badge.classList.toggle("is-open", status.open);
  badge.classList.toggle("is-closed", !status.open);
  badge.textContent = "";
  badge.append(icon, " " + status.text);
}

// Highlights the table row for today. data-day holds the days a row covers,
// like "1 2 3 4", so we split it into a list and look for today's number.
function highlightToday(day) {
  hoursRows.forEach(function (row) {
    const isToday = row.dataset.day.split(" ").includes(String(day));
    row.classList.toggle("table-active", isToday);

    if (isToday) {
      row.setAttribute("aria-current", "date");
    } else {
      row.removeAttribute("aria-current");
    }
  });
}

function updateStatus() {
  const now = getStockholmNow();
  showStatus(getOpenStatus(now.day, now.minutes));
  highlightToday(now.day);
}

updateStatus();

// Check again every minute, so the badge changes by itself when we open or close
setInterval(updateStatus, 60000);
