/* ==========================================================================
   Seat details panel — shows the inspected seat's details and price
   ========================================================================== */

const STATUS_MESSAGES = {
  available: 'Available — not in your cart yet',
  'in-cart': 'In your cart',
  unavailable: 'Unavailable — this seat cannot be booked',
};

/**
 * Fills the details panel for a seat, or shows the empty message when no seat
 * is being inspected. `status` is one of the keys of STATUS_MESSAGES.
 */
function renderSeatDetails(seat, status, container) {
  if (!seat) {
    container.replaceChildren(
      createElement('p', 'panel__empty', 'Click a seat on the map to see its details and price.')
    );
    return;
  }

  const list = createElement('dl', 'seat-info');

  const addRow = (term, value) => {
    const row = createElement('div', 'seat-info__row');
    const description = createElement('dd');
    description.append(value);
    row.append(createElement('dt', null, term), description);
    list.append(row);
  };

  const categorySwatch = createElement('span', 'legend__swatch');
  categorySwatch.style.background = VENUE.priceCategories[seat.category].color;
  const category = createElement('span', 'seat-info__category');
  category.append(categorySwatch, seat.categoryLabel);

  addRow('Section', seat.sectionName);
  addRow('Level', seat.level);
  addRow('Block', seat.blockName);
  addRow('Row', seat.row);
  addRow('Seat', String(seat.number));
  addRow('Category', category);

  container.replaceChildren(
    list,
    createElement('p', 'seat-price', formatPrice(seat.price)),
    createElement('p', `seat-status seat-status--${status}`, STATUS_MESSAGES[status])
  );
}
