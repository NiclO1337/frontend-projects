/* jshint esversion: 6 */
/* exported OPENING_HOURS, toMinutes, getStockholmNow, isOpen */

// Opening hours and helper functions, shared by the pages that need them
// (open-now badge on Hours & Location, time slots on Book a Table).
// These hours must always match the hours table on hours-location.html
// and the short hours in the footer.

// Keys match Date.getDay(): 0 = Sunday ... 6 = Saturday
const OPENING_HOURS = {
  0: { open: "12:00", close: "21:00" },
  1: { open: "11:00", close: "22:00" },
  2: { open: "11:00", close: "22:00" },
  3: { open: "11:00", close: "22:00" },
  4: { open: "11:00", close: "22:00" },
  5: { open: "11:00", close: "23:00" },
  6: { open: "12:00", close: "23:00" },
};

// "11:30" -> 690 (minutes since midnight), so times are easy to compare
function toMinutes(time) {
  const parts = time.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
}

// The current weekday and time in Stockholm, whatever time zone the visitor is in.
// Intl.DateTimeFormat is the browser's built-in tool for dates in a given time
// zone. formatToParts() returns the pieces (weekday, hour, minute) separately,
// so we don't have to read them out of a text string.
// The date can be passed in, which makes it easy to test other times.
function getStockholmNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Stockholm",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23", // 00-23, so midnight is "00" and not "24"
  }).formatToParts(date);

  function getPart(type) {
    return parts.find(function (part) {
      return part.type === type;
    }).value;
  }

  const dayNumbers = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    day: dayNumbers[getPart("weekday")],
    minutes: Number(getPart("hour")) * 60 + Number(getPart("minute")),
  };
}

// Is the restaurant open at this weekday and time? We are open from the
// opening minute up to, but not including, the closing minute.
function isOpen(day, minutes) {
  const hours = OPENING_HOURS[day];
  return minutes >= toMinutes(hours.open) && minutes < toMinutes(hours.close);
}
