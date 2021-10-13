import { Position, Size } from "./math";

class Cell<T> {
  readonly isBottomEdge: boolean;
  readonly isEdge: boolean;
  readonly isHorizontalEdge: boolean;
  readonly isLeftEdge: boolean;
  readonly isRightEdge: boolean;
  readonly isTopEdge: boolean;
  readonly isVerticalEdge: boolean;
  readonly position: Position;
  readonly selectColumn: () => Cell<T>[];
  readonly selectNeighbors: () => Cell<T>[];
  readonly selectRow: () => Cell<T>[];
  constructor(grid: Grid<T>, position: Position) {
    this.isBottomEdge = position.y === grid.size.y - 1;
    this.isTopEdge = position.y === 0;
    this.isLeftEdge = position.x === 0;
    this.isRightEdge = position.x === grid.size.x - 1;
    this.isVerticalEdge = this.isLeftEdge || this.isRightEdge;
    this.isHorizontalEdge = this.isBottomEdge || this.isTopEdge;
    this.isEdge = this.isHorizontalEdge || this.isVerticalEdge;
    this.position = position;
    this.selectColumn = () => grid.selectColumns(position);
    this.selectNeighbors = () =>
      grid.select(
        undefined,
        { x: position.x - 1, y: position.y - 1 },
        { x: position.x - 1, y: position.y },
        { x: position.x - 1, y: position.y + 1 },
        { x: position.x, y: position.y - 1 },
        { x: position.x, y: position.y + 1 },
        { x: position.x + 1, y: position.y - 1 },
        { x: position.x + 1, y: position.y },
        { x: position.x + 1, y: position.y + 1 }
      );
    this.selectRow = () => grid.selectRows(position);
  }
}

export class Grid<T> {
  private readonly _cells: Cell<T>[] = [];
  readonly growSelection: (...origins: Position[]) => Cell<T>[];
  readonly size: Size;
  readonly select: (
    onFilter?: (cell: Cell<T>, index: number, origins: Position[]) => boolean,
    ...origins: Position[]
  ) => Cell<T>[];
  readonly selectAll: () => Cell<T>[];
  readonly selectBottomEdge: () => Cell<T>[];
  readonly selectColumns: (...origins: Position[]) => Cell<T>[];
  readonly selectEdges: () => Cell<T>[];
  readonly selectHorizontalEdges: () => Cell<T>[];
  readonly selectLeftEdge: () => Cell<T>[];
  readonly selectRightEdge: () => Cell<T>[];
  readonly selectRows: (...origins: Position[]) => Cell<T>[];
  readonly selectTopEdge: () => Cell<T>[];
  readonly selectVerticalEdges: () => Cell<T>[];
  constructor(size: Size) {
    this.size = size;
    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        this._cells.push(new Cell<T>(this, { x, y }));
      }
    }
    this.growSelection = (...origins: Position[]): Cell<T>[] => [
      ...new Set(
        origins.flatMap((origin) => {
          const cell = this.select(undefined, origin)[0];
          return cell ? [cell, ...cell.selectNeighbors()] : [];
        })
      ),
    ];
    this.select = (
      onFilter?: (cell: Cell<T>, index: number, origins: Position[]) => boolean,
      ...origins: Position[]
    ): Cell<T>[] =>
      this._cells.filter((cell, index) =>
        onFilter
          ? onFilter(cell, index, origins)
          : origins.some(
              (origin) =>
                origin.x === cell.position.x && origin.y === cell.position.y
            )
      );
    this.selectAll = () => this._cells;
    this.selectBottomEdge = () =>
      this._cells.filter((cell) => cell.isBottomEdge);
    this.selectColumns = (...origins: Position[]): Cell<T>[] =>
      this.select(
        (cell, _index, origins) =>
          origins.some((origin) => cell.position.x === origin.x),
        ...origins
      );
    this.selectEdges = () => this._cells.filter((cell) => cell.isEdge);
    this.selectHorizontalEdges = () =>
      this._cells.filter((cell) => cell.isHorizontalEdge);
    this.selectLeftEdge = () => this._cells.filter((cell) => cell.isLeftEdge);
    this.selectRightEdge = () => this._cells.filter((cell) => cell.isRightEdge);
    this.selectRows = (...origins: Position[]): Cell<T>[] =>
      this.select(
        (cell, _index, origins) =>
          origins.some((origin) => cell.position.y === origin.y),
        ...origins
      );
    this.selectTopEdge = () => this._cells.filter((cell) => cell.isTopEdge);
    this.selectVerticalEdges = () =>
      this._cells.filter((cell) => cell.isVerticalEdge);
  }
}
