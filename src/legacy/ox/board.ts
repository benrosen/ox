import { Cell, Grid } from "./grid";
import { Position, Size } from "./math";

class Tile extends Cell {
  constructor(grid: Grid, position: Position) {
    super(grid, position);
  }
}

export class Board extends Grid {
  constructor(size: Size) {
    super((grid, position) => new Tile(grid, position), size);
  }
}
