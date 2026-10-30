# Velora Theatre — Interactive Venue Ticketing

A front-end ticket-selection website for a theatre, built for Web & Mobile I with plain HTML, CSS and JavaScript.

## Running the project

No build step or dependencies are needed. Open `index.html` in a browser, or serve the folder with any static server, for example:

```
python3 -m http.server 8000
```

and visit http://localhost:8000.

## Project structure

```
index.html          Page structure: venue map, map controls, seat details, cart
css/styles.css      Layout, colours, seat states and responsive rules
js/venue-data.js    The venue described as data: sections, rows, blocks, prices, unavailable seats
js/venue-model.js   Expands the venue data into individual seat objects
js/app.js           Entry point that starts the application
```

## The venue

| Section      | Rows | Seats per row (left / centre / right) | Seats | Price categories              |
|--------------|------|---------------------------------------|-------|-------------------------------|
| Boxes        | A–B  | 4 boxes × 3                           | 24    | Box ₼140                      |
| Stalls       | A–M  | 7 / 14 / 7                            | 336   | Premium ₼95, Standard ₼65, Value ₼40 |
| Dress Circle | A–F  | 8 / 16 / 8                            | 192   | Premium ₼95, Standard ₼65     |
| Balcony      | A–E  | 9 / 18 / 9                            | 180   | Standard ₼65, Value ₼40       |

732 seats in total. Seat IDs follow the pattern `<section>-<block>-<row><number>`, e.g. `stalls-centre-C7`.

## Progress

- [x] Page layout: header, venue map area, navigation toolbar, seat details panel, cart panel
- [x] Venue data model (sections, rows, price categories)
- [ ] Generate seats from data
- [ ] Seat inspection and seat states
- [ ] Zoom, move and reset view controls
- [ ] Add to cart, remove, totals
- [ ] localStorage persistence
- [ ] Responsive polish and edge cases
- [ ] Bonus: mouse-wheel zoom and drag panning
