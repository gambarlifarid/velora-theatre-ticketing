/* ==========================================================================
   Storage — keeps the cart in localStorage so it survives a page refresh
   --------------------------------------------------------------------------
   Only the list of seat IDs is stored, e.g. ["stalls-centre-B3", ...].
   Seat details and prices always come from the venue data, so the stored
   cart cannot change a price.
   ========================================================================== */

const CART_STORAGE_KEY = 'velora-theatre-cart';

/** Saves the cart's seat IDs. Fails quietly if storage is blocked or full. */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('The cart could not be saved:', error);
  }
}

/**
 * Loads the saved cart. Anything that does not make sense any more is dropped:
 * broken JSON, IDs of seats that do not exist, unavailable seats and duplicates.
 */
function loadCart(seatIndex) {
  let saved;

  try {
    saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
  } catch (error) {
    return [];
  }

  if (!Array.isArray(saved)) return [];

  const validIds = saved.filter((seatId) => {
    const seat = seatIndex.get(seatId);
    return seat && !seat.unavailable;
  });

  return [...new Set(validIds)];
}
