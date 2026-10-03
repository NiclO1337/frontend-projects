/* jshint esversion: 6 */
/* global OPENING_HOURS, toMinutes, getStockholmNow, isOpen */

// Open-now badge and "Today" / "Tomorrow" table labels (hours-location.html)
// Needs hours.js to be loaded first.

// Keys match Date.getDay(): 0 = Sunday ... 6 = Saturday
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const badge = document.querySelector("#open-status");

// The HTML groups days that share hours into one row, like "Monday – Thursday",
// with data-day="1 2 3 4". That is what visitors without JavaScript see. Here
// we replace each grouped row with one row per day, so every day can be
// labelled "Today" or "Tomorrow" on its own.
function splitGroupedRows() {
  document.querySelectorAll("[data-day]").forEach(function (row) {
    const days = row.dataset.day.split(" ");

    if (days.length === 1) {
      return;
    }

    // cloneNode(true) copies the row with everything inside it, so every new
    // row keeps the same opening hours cell.
    const dayRows = days.map(function (day) {
      const dayRow = row.cloneNode(true);
      dayRow.dataset.day = day;
      dayRow.querySelector("th").textContent = DAY_NAMES[Number(day)];
      return dayRow;
    });

    row.replaceWith(...dayRows);
  });
}

splitGroupedRows();

// Looked up after the split, so it contains the new rows
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

// Relabels the table rows for today and tomorrow, and highlights today's row.
// By now each row has one day number in data-day.
function labelRows(day) {
  const tomorrow = (day + 1) % 7;

  hoursRows.forEach(function (row) {
    const heading = row.querySelector("th");

    // Remember the real day name the first time, so the row can get its name
    // back later (for example when the page stays open past midnight).
    if (!heading.dataset.name) {
      heading.dataset.name = heading.textContent;
    }

    const rowDay = Number(row.dataset.day);
    const isToday = rowDay === day;

    if (isToday) {
      heading.textContent = "Today";
    } else if (rowDay === tomorrow) {
      heading.textContent = "Tomorrow";
    } else {
      heading.textContent = heading.dataset.name;
    }

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
  labelRows(now.day);
}

updateStatus();

// Check again every minute, so the badge changes by itself when we open or close
setInterval(updateStatus, 60000);
