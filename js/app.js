/* ==========================================================================
   App entry point
   ========================================================================== */

// Every seat in the venue, keyed by seat ID
const seatIndex = buildSeatIndex(VENUE);

// Everything that can change while the page is open
const state = {
  inspectedSeatId: null,
  cart: [], // seat IDs, in the order they were added
};

const venueMap = document.getElementById('venue-map');
const seatDetails = document.getElementById('seat-details');
const addToCartButton = document.getElementById('add-to-cart');

/** Whether a seat can be booked: 'unavailable', 'in-cart' or 'available'. */
function getSeatStatus(seat) {
  if (seat.unavailable) return 'unavailable';
  if (state.cart.includes(seat.id)) return 'in-cart';
  return 'available';
}

function getSeatButton(seatId) {
  return venueMap.querySelector(`[data-seat-id="${seatId}"]`);
}

/** Applies the current state to one seat button on the map. */
function updateSeatButton(seatId) {
  const button = getSeatButton(seatId);
  const isInspected = state.inspectedSeatId === seatId;

  button.classList.toggle('seat--inspected', isInspected);
  button.classList.toggle('seat--in-cart', state.cart.includes(seatId));
  button.setAttribute('aria-pressed', String(isInspected));
}

/** Shows the inspected seat in the details panel and enables ADD TO CART only for available seats. */
function updateDetailsPanel() {
  const seat = seatIndex.get(state.inspectedSeatId);
  const status = seat ? getSeatStatus(seat) : null;

  renderSeatDetails(seat, status, seatDetails);
  addToCartButton.disabled = status !== 'available';
  addToCartButton.textContent = status === 'in-cart' ? 'Already in cart' : 'Add to cart';
}

/** Inspects a seat (or clears the inspection when seatId is null). Does not touch the cart. */
function inspectSeat(seatId) {
  const previousId = state.inspectedSeatId;
  state.inspectedSeatId = seatId;

  if (previousId) updateSeatButton(previousId);
  if (seatId) updateSeatButton(seatId);
  updateDetailsPanel();
}

/**
 * Adds a seat to the cart. Refuses unknown seats, unavailable seats and seats
 * that are already in the cart, so a ticket can never be added twice.
 */
function addToCart(seatId) {
  const seat = seatIndex.get(seatId);
  if (!seat || getSeatStatus(seat) !== 'available') return;

  state.cart.push(seatId);
  updateSeatButton(seatId);
  updateDetailsPanel();
  renderCart();
}

// One listener for all 732 seats: find which seat button was clicked
venueMap.addEventListener('click', (event) => {
  const button = event.target.closest('.seat');
  if (!button) return;

  const seatId = button.dataset.seatId;
  // Clicking the inspected seat again closes the inspection
  inspectSeat(state.inspectedSeatId === seatId ? null : seatId);
});

addToCartButton.addEventListener('click', () => {
  if (state.inspectedSeatId) addToCart(state.inspectedSeatId);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.inspectedSeatId) inspectSeat(null);
});

renderVenue(VENUE, seatIndex, venueMap);
renderPriceLegend(VENUE, document.getElementById('price-legend'));
renderCart();
setupMapControls(); // after rendering, so the venue size is known
