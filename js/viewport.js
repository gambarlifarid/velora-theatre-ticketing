/* ==========================================================================
   Map navigation — zoom in/out, move in four directions, reset view
   --------------------------------------------------------------------------
   The venue canvas sits inside a fixed-size viewport. Navigation never moves
   the seats themselves: it only changes one CSS transform on the canvas,
   translate(x, y) scale(scale), stored in mapView.
   ========================================================================== */

const ZOOM_STEP = 1.25;      // each zoom click scales by 25%
const MAX_SCALE = 2.5;       // closest zoom
const MOVE_FRACTION = 0.2;   // each move click shifts the view by 20% of the viewport
const EDGE_MARGIN = 40;      // how far the venue may be pushed past the viewport edge (px)

const viewportElement = document.getElementById('viewport');
const canvasElement = document.getElementById('venue-canvas');
const zoomLevelOutput = document.getElementById('zoom-level');

const mapView = {
  x: 0,
  y: 0,
  scale: 1,
  minScale: 0.2,
  fitted: true, // true while the user has not moved or zoomed since the last reset
};

/** Clamps a value between a lower and an upper limit. */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Allowed range for one axis, so the venue can never be moved out of sight. */
function axisLimits(viewportSize, contentSize) {
  const a = EDGE_MARGIN;
  const b = viewportSize - contentSize - EDGE_MARGIN;
  return [Math.min(a, b), Math.max(a, b)];
}

/** Keeps the scale and position inside their limits. */
function clampView() {
  mapView.scale = clamp(mapView.scale, mapView.minScale, MAX_SCALE);

  const [minX, maxX] = axisLimits(viewportElement.clientWidth, canvasElement.offsetWidth * mapView.scale);
  const [minY, maxY] = axisLimits(viewportElement.clientHeight, canvasElement.offsetHeight * mapView.scale);

  mapView.x = clamp(mapView.x, minX, maxX);
  mapView.y = clamp(mapView.y, minY, maxY);
}

/** Writes mapView to the canvas transform and updates the toolbar. */
function applyView() {
  clampView();
  canvasElement.style.transform =
    `translate(${mapView.x}px, ${mapView.y}px) scale(${mapView.scale})`;

  zoomLevelOutput.textContent = `${Math.round(mapView.scale * 100)}%`;
  document.getElementById('zoom-in').disabled = mapView.scale >= MAX_SCALE;
  document.getElementById('zoom-out').disabled = mapView.scale <= mapView.minScale;
}

/**
 * Zooms by a factor around a point in the viewport (by default its centre),
 * so the seat under that point stays in place.
 */
function zoomBy(factor, originX = viewportElement.clientWidth / 2, originY = viewportElement.clientHeight / 2) {
  const newScale = clamp(mapView.scale * factor, mapView.minScale, MAX_SCALE);
  const ratio = newScale / mapView.scale;

  mapView.x = originX - (originX - mapView.x) * ratio;
  mapView.y = originY - (originY - mapView.y) * ratio;
  mapView.scale = newScale;
  mapView.fitted = false;
  applyView();
}

/** Moves the view. Positive dx/dy reveal more of the right/bottom of the venue. */
function moveBy(dx, dy) {
  mapView.x -= dx;
  mapView.y -= dy;
  mapView.fitted = false;
  applyView();
}

/** Fits the whole venue in the viewport and centres it. */
function resetView() {
  const viewWidth = viewportElement.clientWidth;
  const viewHeight = viewportElement.clientHeight;
  const contentWidth = canvasElement.offsetWidth;
  const contentHeight = canvasElement.offsetHeight;

  const fitScale = Math.min(viewWidth / contentWidth, viewHeight / contentHeight, 1);

  mapView.minScale = fitScale * 0.8;
  mapView.scale = fitScale;
  mapView.x = (viewWidth - contentWidth * fitScale) / 2;
  mapView.y = (viewHeight - contentHeight * fitScale) / 2;
  mapView.fitted = true;
  applyView();
}

/** Connects the toolbar buttons and starts with the whole venue in view. */
function setupMapControls() {
  const moveStepX = () => viewportElement.clientWidth * MOVE_FRACTION;
  const moveStepY = () => viewportElement.clientHeight * MOVE_FRACTION;

  document.getElementById('zoom-in').addEventListener('click', () => zoomBy(ZOOM_STEP));
  document.getElementById('zoom-out').addEventListener('click', () => zoomBy(1 / ZOOM_STEP));
  document.getElementById('move-up').addEventListener('click', () => moveBy(0, -moveStepY()));
  document.getElementById('move-down').addEventListener('click', () => moveBy(0, moveStepY()));
  document.getElementById('move-left').addEventListener('click', () => moveBy(-moveStepX(), 0));
  document.getElementById('move-right').addEventListener('click', () => moveBy(moveStepX(), 0));
  document.getElementById('reset-view').addEventListener('click', resetView);

  // When the window size changes, refit if the user has not navigated, otherwise just re-check the limits
  window.addEventListener('resize', () => {
    if (mapView.fitted) resetView();
    else applyView();
  });

  // Place the venue instantly on page load instead of animating it into position
  canvasElement.style.transition = 'none';
  resetView();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { canvasElement.style.transition = ''; });
  });
}
