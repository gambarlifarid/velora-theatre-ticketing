/* ==========================================================================
   Cart — list of selected tickets, ticket count and total price
   ========================================================================== */

const cartList = document.getElementById('cart-list');
const cartEmptyMessage = document.getElementById('cart-empty');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

/** The seat objects currently in the cart, in the order they were added. */
function getCartSeats() {
  return state.cart.map((seatId) => seatIndex.get(seatId));
}

/** Sum of the ticket prices. */
function getCartTotal(seats) {
  return seats.reduce((sum, seat) => sum + seat.price, 0);
}

/** One ticket in the cart list. */
function createCartItem(seat) {
  const item = createElement('li', 'cart-item');
  item.dataset.seatId = seat.id;

  const swatch = createElement('span', 'legend__swatch');
  swatch.style.background = VENUE.priceCategories[seat.category].color;

  const info = createElement('div', 'cart-item__info');
  info.append(
    createElement('span', 'cart-item__name', describeSeat(seat)),
    createElement('span', 'cart-item__meta', `${seat.categoryLabel} · ${seat.sectionName}`)
  );

  const removeButton = createElement('button', 'cart-item__remove', '×');
  removeButton.type = 'button';
  removeButton.setAttribute('aria-label', `Remove ${describeSeat(seat)} from cart`);
  removeButton.title = 'Remove from cart';

  item.append(swatch, info, createElement('span', 'cart-item__price', formatPrice(seat.price)), removeButton);
  return item;
}

/** Redraws the cart list, count and total from state.cart. */
function renderCart() {
  const seats = getCartSeats();

  cartList.replaceChildren(...seats.map(createCartItem));
  cartEmptyMessage.hidden = seats.length > 0;
  cartCount.textContent = seats.length;
  cartTotal.textContent = formatPrice(getCartTotal(seats));
}
