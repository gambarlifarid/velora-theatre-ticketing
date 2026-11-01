/* ==========================================================================
   Rendering — builds the venue map in the DOM from the VENUE data
   --------------------------------------------------------------------------
   Every seat becomes a <button>. Nothing is hard-coded in the HTML: changing
   the data in venue-data.js changes the map.
   ========================================================================== */

/** Small helper: create an element with a class name and optional text. */
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

/** One seat button. The seat ID is stored in data-seat-id so clicks can find the seat. */
function createSeatButton(seat) {
  const button = createElement('button', 'seat', seat.number);
  button.type = 'button';
  button.dataset.seatId = seat.id;
  button.style.setProperty('--seat-color', VENUE.priceCategories[seat.category].color);

  let label = `${describeSeat(seat)}, ${seat.categoryLabel}, ${formatPrice(seat.price)}`;

  if (seat.unavailable) {
    // Kept clickable so the user can still inspect it, but marked as not selectable
    button.classList.add('seat--unavailable');
    button.setAttribute('aria-disabled', 'true');
    label += ', unavailable';
  }

  button.setAttribute('aria-label', label);
  return button;
}

/** One block of seats in a row (the seats between two aisles). */
function createBlock(section, block, row, seatIndex) {
  const blockElement = createElement('div', 'seat-block');

  for (let number = 1; number <= block.seats; number++) {
    const seat = seatIndex.get(makeSeatId(section.id, block.id, row, number));
    if (seat) blockElement.append(createSeatButton(seat));
  }

  return blockElement;
}

/** One row: row letter on both ends, blocks in between separated by aisles. */
function createRow(section, row, blocks, seatIndex) {
  const rowElement = createElement('div', 'seat-row');

  rowElement.append(createElement('span', 'seat-row__label', row));
  blocks.forEach((block) => rowElement.append(createBlock(section, block, row, seatIndex)));
  rowElement.append(createElement('span', 'seat-row__label', row));

  return rowElement;
}

/** A full section (Stalls, Dress Circle, Balcony) with its title and all rows. */
function createSection(section, seatIndex) {
  const sectionElement = createElement('section', `seat-section seat-section--${section.id}`);
  sectionElement.setAttribute('aria-label', section.name);

  const title = createElement('h2', 'seat-section__title', section.name);
  title.append(createElement('span', 'seat-section__level', section.level));
  sectionElement.append(title);

  section.rows.forEach((row) => {
    sectionElement.append(createRow(section, row, section.blocks, seatIndex));
  });

  return sectionElement;
}

/** The boxes on one side of the hall. Each box is drawn as its own small group. */
function createBoxColumn(section, side, seatIndex) {
  const column = createElement('div', `box-column box-column--${side}`);

  section.blocks
    .filter((block) => block.side === side)
    .forEach((block) => {
      const box = createElement('div', 'box');
      box.setAttribute('role', 'group');
      box.setAttribute('aria-label', block.name);
      box.append(createElement('h3', 'box__title', block.name));

      section.rows.forEach((row) => box.append(createRow(section, row, [block], seatIndex)));
      column.append(box);
    });

  return column;
}

/** Draws the whole venue into the container, replacing whatever was there. */
function renderVenue(venue, seatIndex, container) {
  const fragment = document.createDocumentFragment();
  const sideSections = venue.sections.filter((section) => section.layout === 'sides');

  venue.sections.forEach((section) => {
    if (section.layout === 'sides') return; // drawn next to the section they sit beside

    const sectionElement = createSection(section, seatIndex);
    const besideThis = sideSections.find((side) => side.besideSection === section.id);

    if (besideThis) {
      // Left boxes | section | right boxes
      const level = createElement('div', 'venue-level');
      level.append(
        createBoxColumn(besideThis, 'left', seatIndex),
        sectionElement,
        createBoxColumn(besideThis, 'right', seatIndex)
      );
      fragment.append(level);
    } else {
      fragment.append(sectionElement);
    }
  });

  container.replaceChildren(fragment);
}

/** Builds the price legend (one entry per price category) from the data. */
function renderPriceLegend(venue, list) {
  list.replaceChildren(
    ...Object.values(venue.priceCategories).map((category) => {
      const item = createElement('li', 'legend__item');
      const swatch = createElement('span', 'legend__swatch');
      swatch.style.background = category.color;
      item.append(swatch, `${category.label} ${formatPrice(category.price)}`);
      return item;
    })
  );
}
