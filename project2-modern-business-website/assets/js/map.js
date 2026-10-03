/* jshint esversion: 6 */

// Shows the Google Map (hours-location.html)
// The map is hidden in the HTML because Google's map needs JavaScript to draw
// itself. Without JavaScript it would only show a blank white box, so we reveal
// it here, and a <noscript> link is shown to visitors without JavaScript.

const mapFrame = document.querySelector("#map-frame");

mapFrame.hidden = false;
