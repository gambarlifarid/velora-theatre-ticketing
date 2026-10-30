/* ==========================================================================
   App entry point
   ========================================================================== */

// Every seat in the venue, keyed by seat ID
const seatIndex = buildSeatIndex(VENUE);

console.info(
  `${VENUE.name}: ${seatIndex.size} seats in ${VENUE.sections.length} sections ` +
  `(${VENUE.unavailableSeats.length} unavailable)`
);
