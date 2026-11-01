/* ==========================================================================
   Velora Theatre — venue data
   --------------------------------------------------------------------------
   The whole venue is described here as plain data. No seat is written by
   hand in the HTML: every seat is generated from these sections, rows and
   blocks.

   Structure:
     section  → a part of the theatre (Stalls, Dress Circle, Balcony, Boxes)
     rows     → row letters in that section, front (nearest the stage) first
     blocks   → groups of seats in each row, separated by aisles
     pricing  → which price category each row belongs to

   A seat ID is built as  <section>-<block>-<row><number>,
   for example "stalls-centre-C7" = Stalls, centre block, row C, seat 7.
   ========================================================================== */

const VENUE = {
  name: 'Velora Theatre',
  currency: '₼',

  // Ticket price categories. Colours are used to tint available seats on the map.
  priceCategories: {
    box:      { label: 'Box',      price: 140, color: '#e8dcc4' },
    premium:  { label: 'Premium',  price: 95,  color: '#c85a7c' },
    standard: { label: 'Standard', price: 65,  color: '#6c8ebf' },
    value:    { label: 'Value',    price: 40,  color: '#9a8bc4' },
  },

  sections: [
    {
      id: 'boxes',
      name: 'Boxes',
      level: 'Ground floor, beside the stage',
      layout: 'sides',      // blocks are split to the left and right...
      besideSection: 'stalls', // ...of the Stalls
      rows: ['A', 'B'],
      blocks: [
        { id: 'box1', name: 'Box 1', seats: 3, side: 'left' },
        { id: 'box2', name: 'Box 2', seats: 3, side: 'left' },
        { id: 'box3', name: 'Box 3', seats: 3, side: 'right' },
        { id: 'box4', name: 'Box 4', seats: 3, side: 'right' },
      ],
      pricing: [
        { category: 'box', rows: ['A', 'B'] },
      ],
    },
    {
      id: 'stalls',
      name: 'Stalls',
      level: 'Ground floor',
      // Theatres traditionally skip the letter I so it is not confused with 1
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      blocks: [
        { id: 'left',   name: 'Stalls Left',   seats: 7 },
        { id: 'centre', name: 'Stalls Centre', seats: 14 },
        { id: 'right',  name: 'Stalls Right',  seats: 7 },
      ],
      pricing: [
        { category: 'premium',  rows: ['A', 'B', 'C', 'D', 'E'] },
        { category: 'standard', rows: ['F', 'G', 'H', 'J'] },
        { category: 'value',    rows: ['K', 'L', 'M'] },
      ],
    },
    {
      id: 'circle',
      name: 'Dress Circle',
      level: 'First floor',
      rows: ['A', 'B', 'C', 'D', 'E', 'F'],
      blocks: [
        { id: 'left',   name: 'Circle Left',   seats: 8 },
        { id: 'centre', name: 'Circle Centre', seats: 16 },
        { id: 'right',  name: 'Circle Right',  seats: 8 },
      ],
      pricing: [
        { category: 'premium',  rows: ['A', 'B'] },
        { category: 'standard', rows: ['C', 'D', 'E', 'F'] },
      ],
    },
    {
      id: 'balcony',
      name: 'Balcony',
      level: 'Second floor',
      rows: ['A', 'B', 'C', 'D', 'E'],
      blocks: [
        { id: 'left',   name: 'Balcony Left',   seats: 9 },
        { id: 'centre', name: 'Balcony Centre', seats: 18 },
        { id: 'right',  name: 'Balcony Right',  seats: 9 },
      ],
      pricing: [
        { category: 'standard', rows: ['A', 'B'] },
        { category: 'value',    rows: ['C', 'D', 'E'] },
      ],
    },
  ],

  // Seats already sold or blocked off. They are shown on the map but cannot be added to the cart.
  unavailableSeats: [
    'boxes-box2-A1', 'boxes-box2-A2', 'boxes-box2-A3',
    'boxes-box3-B2',

    'stalls-centre-A6', 'stalls-centre-A7', 'stalls-centre-A8', 'stalls-centre-A9',
    'stalls-centre-B7', 'stalls-centre-B8',
    'stalls-left-C3', 'stalls-left-C4',
    'stalls-centre-D11', 'stalls-centre-D12', 'stalls-centre-D13',
    'stalls-right-E1', 'stalls-right-E2',
    'stalls-centre-G5', 'stalls-centre-G6',
    'stalls-left-J1', 'stalls-left-J2', 'stalls-left-J3',
    'stalls-centre-L9', 'stalls-centre-L10',

    'circle-centre-A8', 'circle-centre-A9',
    'circle-left-B5', 'circle-left-B6',
    'circle-centre-C12', 'circle-centre-C13', 'circle-centre-C14',
    'circle-right-E4',

    'balcony-centre-A9', 'balcony-centre-A10',
    'balcony-left-C2', 'balcony-left-C3',
    'balcony-right-D7', 'balcony-right-D8', 'balcony-right-D9',
  ],
};
