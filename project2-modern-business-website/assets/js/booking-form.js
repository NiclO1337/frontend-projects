/* jshint esversion: 6 */
/* global OPENING_HOURS, toMinutes, getStockholmNow */

// Booking form (book.html). Nothing is sent anywhere: when the form is valid,
// a confirmation is shown instead. Needs hours.js to be loaded first.

const BOOKING_DAYS_AHEAD = 60;
const SLOT_LENGTH = 30; // minutes between table times
const LAST_TABLE_BEFORE_CLOSING = 60; // minutes

const form = document.querySelector("#booking-form");
const formCard = document.querySelector("#booking-form-card");
const confirmation = document.querySelector("#booking-confirmation");
const confirmationHeading = document.querySelector("#booking-confirmation-heading");
const confirmationSummary = document.querySelector("#booking-confirmation-summary");
const resetButton = document.querySelector("#booking-reset");

const nameField = document.querySelector("#booking-name");
const emailField = document.querySelector("#booking-email");
const dateField = document.querySelector("#booking-date");
const timeField = document.querySelector("#booking-time");
const guestsField = document.querySelector("#booking-guests");

// The fields that show error messages (phone and message are optional)
const checkedFields = [nameField, emailField, dateField, timeField];

// Our own error texts, written for humans. Each key is a flag from the
// Constraint Validation API (field.validity.valueMissing and so on).
const errorMessages = {
  "booking-name": {
    valueMissing: "Please enter your name.",
  },
  "booking-email": {
    valueMissing: "Please enter your email address.",
    typeMismatch: "Please enter a valid email address, like name@example.com.",
  },
  "booking-date": {
    valueMissing: "Please choose a date.",
    badInput: "Please enter a valid date.",
    rangeUnderflow: "Please choose today or a later date.",
    rangeOverflow: "We take bookings up to " + BOOKING_DAYS_AHEAD + " days ahead.",
  },
  "booking-time": {
    valueMissing: "Please choose a time.",
  },
};

// Errors are only shown after the first send attempt, so nobody is told off
// while they are still typing for the first time
let hasTriedToSubmit = false;

// ---------- Dates and time slots ----------

// Today's date in Stockholm as "2026-10-03", the format date inputs use
function getStockholmDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  function getPart(type) {
    return parts.find(function (part) {
      return part.type === type;
    }).value;
  }

  return getPart("year") + "-" + getPart("month") + "-" + getPart("day");
}

// "2026-10-03" + 60 days. The date is read as UTC midnight so daylight saving
// time can never move it to the wrong day.
function addDays(dateString, days) {
  const date = new Date(dateString + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// 0 = Sunday ... 6 = Saturday, the same numbers as OPENING_HOURS
function getWeekday(dateString) {
  return new Date(dateString + "T00:00:00Z").getUTCDay();
}

// 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 11 -> "11th", 21 -> "21st".
// Intl.PluralRules knows the English rules for ordinal numbers, including the
// odd ones (11th, 12th, 13th), and tells us which group a number belongs to.
const ordinalSuffixes = { one: "st", two: "nd", few: "rd", other: "th" };

function addOrdinal(number) {
  const group = new Intl.PluralRules("en", { type: "ordinal" }).select(number);
  return number + ordinalSuffixes[group];
}

// "2026-10-03" -> "Saturday the 3rd of October". Built from parts so the
// result does not depend on the commas a browser puts in.
function formatDate(dateString) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).formatToParts(new Date(dateString + "T00:00:00Z"));

  function getPart(type) {
    return parts.find(function (part) {
      return part.type === type;
    }).value;
  }

  return getPart("weekday") + " the " + addOrdinal(Number(getPart("day"))) + " of " + getPart("month");
}

// 690 -> "11:30"
function formatTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const rest = String(minutes % 60).padStart(2, "0");
  return hours + ":" + rest;
}

// Table times for a weekday: every 30 minutes from opening until one hour
// before closing. If the booking is for today, nowMinutes is the current
// time in Stockholm and times that have already passed are left out.
// For other days, pass null.
function getTimeSlots(day, nowMinutes) {
  const hours = OPENING_HOURS[day];
  const lastSlot = toMinutes(hours.close) - LAST_TABLE_BEFORE_CLOSING;
  const slots = [];

  for (let minutes = toMinutes(hours.open); minutes <= lastSlot; minutes += SLOT_LENGTH) {
    if (nowMinutes === null || minutes > nowMinutes) {
      slots.push(formatTime(minutes));
    }
  }

  return slots;
}

// The time list is locked until there is something to choose from.
// new Option(text, value) is a short way to create an <option> element.
function lockTimeField(message) {
  timeField.textContent = "";
  timeField.append(new Option(message, ""));
  timeField.disabled = true;
}

// Rebuilds the time list for the chosen date
function updateTimeSlots() {
  dateField.setCustomValidity(""); // clear our own error from last time

  // No date yet, or a date that is not allowed: nothing to choose from
  if (dateField.value === "" || !dateField.checkValidity()) {
    lockTimeField("Choose a date first");
    return;
  }

  const isToday = dateField.value === getStockholmDate();
  const nowMinutes = isToday ? getStockholmNow().minutes : null;
  const slots = getTimeSlots(getWeekday(dateField.value), nowMinutes);

  if (slots.length === 0) {
    // setCustomValidity() marks the field as invalid with a message of our own
    dateField.setCustomValidity("Sorry, there are no tables left today. Please choose another day.");
    lockTimeField("No times left today");
    return;
  }

  const previousTime = timeField.value; // keep the choice if it is still possible
  timeField.textContent = "";
  timeField.append(new Option("Choose a time", ""));
  slots.forEach(function (slot) {
    timeField.append(new Option(slot, slot));
  });
  timeField.disabled = false;

  if (slots.includes(previousTime)) {
    timeField.value = previousTime;
  }
}

// ---------- Validation ----------

// Checks that the browser's built-in rules do not cover
function updateCustomValidity() {
  // A name of only spaces passes "required", so check for that here
  const nameIsBlank = nameField.value.length > 0 && nameField.value.trim() === "";
  nameField.setCustomValidity(nameIsBlank ? "Please enter your name." : "");

  // type="email" accepts "anna@home", so also ask for a dot in the domain
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value);
  const emailIsWrong = emailField.value !== "" && !looksLikeEmail;
  emailField.setCustomValidity(emailIsWrong ? errorMessages["booking-email"].typeMismatch : "");
}

// Picks the message for the first broken rule of a field
function getErrorMessage(field) {
  const messages = errorMessages[field.id];

  for (const flag in messages) {
    if (field.validity[flag]) {
      return messages[flag];
    }
  }

  // No built-in rule is broken, so it is one of our own (setCustomValidity)
  return field.validationMessage;
}

function clearFieldState(field) {
  field.classList.remove("is-valid", "is-invalid");
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
}

// Shows one field as valid or invalid. Bootstrap's is-invalid class reveals
// the .invalid-feedback text under the field. aria-invalid and aria-describedby
// make screen readers say that the field is wrong and read the message.
function showFieldState(field) {
  if (field.disabled) {
    clearFieldState(field);
    return;
  }

  const feedback = document.querySelector("#" + field.id + "-error");

  if (field.checkValidity()) {
    clearFieldState(field);
    field.classList.add("is-valid");
  } else {
    feedback.textContent = getErrorMessage(field);
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", feedback.id);
  }
}

// Checks every field and returns true if all of them are fine
function validateAll() {
  updateCustomValidity();
  checkedFields.forEach(showFieldState);

  return checkedFields.every(function (field) {
    return field.checkValidity();
  });
}

// ---------- Confirmation ----------

function showConfirmation() {
  const firstName = nameField.value.trim().split(" ")[0];
  const guests = Number(guestsField.value);
  const guestText = guests === 1 ? "1 guest" : guests + " guests";

  // textContent (not innerHTML) so that nothing typed in the form is treated as HTML
  confirmationHeading.textContent = "Thanks, " + firstName + "!";
  confirmationSummary.textContent =
    "Your request for " + guestText + " on " + formatDate(dateField.value) + " at " + timeField.value + " is noted.";

  formCard.hidden = true;
  confirmation.hidden = false;
  confirmationHeading.focus(); // keyboard and screen reader users land on the confirmation
}

function resetBooking() {
  form.reset();
  hasTriedToSubmit = false;
  checkedFields.forEach(clearFieldState);
  updateTimeSlots(); // the date is empty again, so the time list locks

  confirmation.hidden = true;
  formCard.hidden = false;
  nameField.focus();
}

// ---------- Events ----------

// The date decides which times can be chosen
dateField.min = getStockholmDate();
dateField.max = addDays(getStockholmDate(), BOOKING_DAYS_AHEAD);
updateTimeSlots();

// Once a send attempt has been made, messages update while the person fixes things
function refreshMessages() {
  if (hasTriedToSubmit) {
    validateAll();
  }
}

dateField.addEventListener("input", function () {
  updateTimeSlots();
  refreshMessages();
});

[nameField, emailField, timeField].forEach(function (field) {
  field.addEventListener("input", refreshMessages);
});

form.addEventListener("submit", function (event) {
  event.preventDefault(); // nothing is sent, the script handles it
  hasTriedToSubmit = true;
  updateTimeSlots(); // times may have passed since the date was chosen

  if (validateAll()) {
    showConfirmation();
    return;
  }

  // Move focus to the first field that needs fixing
  checkedFields.find(function (field) {
    return !field.checkValidity();
  }).focus();
});

resetButton.addEventListener("click", resetBooking);
