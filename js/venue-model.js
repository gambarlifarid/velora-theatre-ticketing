/* ==========================================================================
   Venue model — turns the VENUE data into individual seat objects
   ========================================================================== */

/** Builds the unique ID of a seat, e.g. "stalls-centre-C7". */
function makeSeatId(sectionId, blockId, row, number) {
  return `${sectionId}-${blockId}-${row}${number}`;
}

/** Finds the price category key for a row of a section (e.g. "premium"). */
function getRowCategory(section, row) {
  const rule = section.pricing.find((entry) => entry.rows.includes(row));
  return rule ? rule.category : null;
}

/**
 * Expands the venue data into one object per seat.
 * Returns a Map of seat ID → seat, in the same order the seats appear in the
 * data (section by section, row by row, block by block, seat by seat).
 */
function buildSeatIndex(venue) {
  const seats = new Map();
  const unavailable = new Set(venue.unavailableSeats);

  venue.sections.forEach((section) => {
    section.rows.forEach((row) => {
      const categoryKey = getRowCategory(section, row);
      const category = venue.priceCategories[categoryKey];

      if (!category) {
        console.warn(`No price category for ${section.name} row ${row}`);
        return;
      }

      section.blocks.forEach((block) => {
        for (let number = 1; number <= block.seats; number++) {
          const id = makeSeatId(section.id, block.id, row, number);

          seats.set(id, {
            id,
            sectionId: section.id,
            sectionName: section.name,
            level: section.level,
            blockId: block.id,
            blockName: block.name,
            row,
            number,
            category: categoryKey,
            categoryLabel: category.label,
            price: category.price,
            unavailable: unavailable.has(id),
          });
        }
      });
    });
  });

  // Catch typos in the unavailable list: every ID must match a real seat
  unavailable.forEach((id) => {
    if (!seats.has(id)) {
      console.warn(`Unavailable seat "${id}" does not exist in the venue`);
    }
  });

  return seats;
}

/** Formats an amount in the venue currency, e.g. "₼95.00". */
function formatPrice(amount) {
  return `${VENUE.currency}${amount.toFixed(2)}`;
}

/** A readable label for a seat, e.g. "Stalls Centre · Row C · Seat 7". */
function describeSeat(seat) {
  return `${seat.blockName} · Row ${seat.row} · Seat ${seat.number}`;
}
