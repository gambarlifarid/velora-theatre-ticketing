/* ==========================================================================
   App entry point
   ========================================================================== */

// Every seat in the venue, keyed by seat ID
const seatIndex = buildSeatIndex(VENUE);

// Everything that can change while the page is open
const state = {
  inspectedSeatId: null,
};

const venueMap = document.getElementById('venue-map');
const seatDetails = document.getElementById('seat-details');
const addToCartButton = document.getElementById('add-to-cart');

/** Whether a seat can be booked: 'unavailable' or 'available'. */
function getSeatStatus(seat) {
  return seat.unavailable ? 'unavailable' : 'available';
}

function getSeatButton(seatId) {
  return venueMap.querySelector(`[data-seat-id="${seatId}"]`);
}

/** Applies the current state to one seat button on the map. */
function updateSeatButton(seatId) {
  const button = getSeatButton(seatId);
  const isInspected = state.inspectedSeatId === seatId;

  button.classList.toggle('seat--inspected', isInspected);
  button.setAttribute('aria-pressed', String(isInspected));
}

/** Shows the inspected seat in the details panel and enables ADD TO CART when allowed. */
function updateDetailsPanel() {
  const seat = seatIndex.get(state.inspectedSeatId);
  const status = seat ? getSeatStatus(seat) : null;

  renderSeatDetails(seat, status, seatDetails);
  addToCartButton.disabled = status !== 'available';
}

/** Inspects a seat (or clears the inspection when seatId is null). Does not touch the cart. */
function inspectSeat(seatId) {
  const previousId = state.inspectedSeatId;
  state.inspectedSeatId = seatId;

  if (previousId) updateSeatButton(previousId);
  if (seatId) updateSeatButton(seatId);
  updateDetailsPanel();
}

// One listener for all 732 seats: find which seat button was clicked
venueMap.addEventListener('click', (event) => {
  const button = event.target.closest('.seat');
  if (!button) return;

  const seatId = button.dataset.seatId;
  // Clicking the inspected seat again closes the inspection
  inspectSeat(state.inspectedSeatId === seatId ? null : seatId);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.inspectedSeatId) inspectSeat(null);
});

renderVenue(VENUE, seatIndex, venueMap);
renderPriceLegend(VENUE, document.getElementById('price-legend'));
setupMapControls(); // after rendering, so the venue size is known
