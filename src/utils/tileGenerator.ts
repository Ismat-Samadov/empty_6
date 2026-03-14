// ============================================================
// Tile Generator Utilities
// ============================================================

import { Tile, TileRow } from "./gameTypes";
import { COLUMN_COUNT } from "./gameConstants";

let nextTileId = 0;
let nextRowId = 0;

/** Reset ID counters (call on new game) */
export function resetIds(): void {
  nextTileId = 0;
  nextRowId = 0;
}

/**
 * Generate a new row of tiles.
 * Exactly one random column is black; others are white.
 * @param y  The starting Y position (top) for the row
 * @param tileHeight  Height of each tile
 */
export function generateRow(y: number, tileHeight: number): TileRow {
  const blackCol = Math.floor(Math.random() * COLUMN_COUNT);

  const tiles: Tile[] = Array.from({ length: COLUMN_COUNT }, (_, col) => ({
    id: nextTileId++,
    column: col,
    y,
    height: tileHeight,
    isBlack: col === blackCol,
    tapped: false,
    missed: false,
  }));

  return {
    id: nextRowId++,
    tiles,
    y,
  };
}

/**
 * Pre-generate the initial set of rows above the viewport
 * so the board is full when the game starts.
 */
export function generateInitialRows(
  canvasHeight: number,
  tileHeight: number,
  rowGap: number
): TileRow[] {
  const rows: TileRow[] = [];
  const rowStep = tileHeight + rowGap;
  // Start rows above the canvas so they fall in naturally
  let y = -tileHeight;
  while (y > -(canvasHeight + tileHeight)) {
    rows.unshift(generateRow(y, tileHeight));
    y -= rowStep;
  }
  return rows;
}
