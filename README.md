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
index.html        Page structure: venue map, map controls, seat details, cart
css/styles.css    Layout, colours, seat states and responsive rules
```

## Progress

- [x] Page layout: header, venue map area, navigation toolbar, seat details panel, cart panel
- [ ] Venue data model (sections, rows, price categories)
- [ ] Generate seats from data
- [ ] Seat inspection and seat states
- [ ] Zoom, move and reset view controls
- [ ] Add to cart, remove, totals
- [ ] localStorage persistence
- [ ] Responsive polish and edge cases
- [ ] Bonus: mouse-wheel zoom and drag panning
