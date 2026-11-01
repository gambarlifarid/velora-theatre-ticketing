/* ==========================================================================
   App entry point
   ========================================================================== */

// Every seat in the venue, keyed by seat ID
const seatIndex = buildSeatIndex(VENUE);

renderVenue(VENUE, seatIndex, document.getElementById('venue-map'));
renderPriceLegend(VENUE, document.getElementById('price-legend'));
