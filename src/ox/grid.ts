import { Position, Size } from "./math";

class Cell<T> {
  private readonly _grid: Grid<T>;
  readonly position: Position;
  constructor(grid: Grid<T>, position: Position) {
    this._grid = grid;
    this.position = position;
  }
}

class Grid<T> {
  private readonly _cells: Cell<T>[] = [];
  constructor(size: Size) {
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        this._cells.push(new Cell<T>(this, { x, y }));
      }
    }
  }
}
