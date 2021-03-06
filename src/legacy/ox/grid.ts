// import { Position, Size } from "./math";

// export class Cell {
//   readonly isBottomEdge: boolean;
//   readonly isEdge: boolean;
//   readonly isHorizontalEdge: boolean;
//   readonly isLeftEdge: boolean;
//   readonly isRightEdge: boolean;
//   readonly isTopEdge: boolean;
//   readonly isVerticalEdge: boolean;
//   readonly position: Position;
//   readonly selectColumn: () => Cell[];
//   readonly selectNeighbors: () => Cell[];
//   readonly selectRow: () => Cell[];
//   constructor(grid: Grid, position: Position) {
//     this.isBottomEdge = position.y === grid.size.y - 1;
//     this.isTopEdge = position.y === 0;
//     this.isLeftEdge = position.x === 0;
//     this.isRightEdge = position.x === grid.size.x - 1;
//     this.isVerticalEdge = this.isLeftEdge || this.isRightEdge;
//     this.isHorizontalEdge = this.isBottomEdge || this.isTopEdge;
//     this.isEdge = this.isHorizontalEdge || this.isVerticalEdge;
//     this.position = position;
//     this.selectColumn = () => grid.selectColumns(position);
//     this.selectNeighbors = () =>
//       grid.select(
//         undefined,
//         { x: position.x - 1, y: position.y - 1 },
//         { x: position.x - 1, y: position.y },
//         { x: position.x - 1, y: position.y + 1 },
//         { x: position.x, y: position.y - 1 },
//         { x: position.x, y: position.y + 1 },
//         { x: position.x + 1, y: position.y - 1 },
//         { x: position.x + 1, y: position.y },
//         { x: position.x + 1, y: position.y + 1 }
//       );
//     this.selectRow = () => grid.selectRows(position);
//   }
// }

// export class Grid {
//   private readonly _cells: Cell[] = [];
//   readonly growSelection: (...origins: Position[]) => Cell[];
//   readonly size: Size;
//   readonly select: (
//     onFilter?: (cell: Cell, index: number, origins: Position[]) => boolean,
//     ...origins: Position[]
//   ) => Cell[];
//   readonly selectAll: () => Cell[];
//   readonly selectBottomEdge: () => Cell[];
//   readonly selectColumns: (...origins: Position[]) => Cell[];
//   readonly selectEdges: () => Cell[];
//   readonly selectHorizontalEdges: () => Cell[];
//   readonly selectLeftEdge: () => Cell[];
//   readonly selectRightEdge: () => Cell[];
//   readonly selectRows: (...origins: Position[]) => Cell[];
//   readonly selectTopEdge: () => Cell[];
//   readonly selectVerticalEdges: () => Cell[];
//   constructor(
//     onCreateCell: (grid: Grid, position: Position) => Cell,
//     size: Size
//   ) {
//     this.size = size;
//     for (let x = 0; x < this.size.x; x++) {
//       for (let y = 0; y < this.size.y; y++) {
//         this._cells.push(onCreateCell(this, { x, y }));
//       }
//     }
//     this.growSelection = (...origins: Position[]): Cell[] => [
//       ...new Set(
//         origins.flatMap((origin) => {
//           const cell = this.select(undefined, origin)[0];
//           return cell ? [cell, ...cell.selectNeighbors()] : [];
//         })
//       ),
//     ];
//     this.select = (
//       onFilter?: (cell: Cell, index: number, origins: Position[]) => boolean,
//       ...origins: Position[]
//     ): Cell[] =>
//       this._cells.filter((cell, index) =>
//         onFilter
//           ? onFilter(cell, index, origins)
//           : origins.some(
//               (origin) =>
//                 origin.x === cell.position.x && origin.y === cell.position.y
//             )
//       );
//     this.selectAll = () => this._cells;
//     this.selectBottomEdge = () =>
//       this._cells.filter((cell) => cell.isBottomEdge);
//     this.selectColumns = (...origins: Position[]): Cell[] =>
//       this.select(
//         (cell, _index, origins) =>
//           origins.some((origin) => cell.position.x === origin.x),
//         ...origins
//       );
//     this.selectEdges = () => this._cells.filter((cell) => cell.isEdge);
//     this.selectHorizontalEdges = () =>
//       this._cells.filter((cell) => cell.isHorizontalEdge);
//     this.selectLeftEdge = () => this._cells.filter((cell) => cell.isLeftEdge);
//     this.selectRightEdge = () => this._cells.filter((cell) => cell.isRightEdge);
//     this.selectRows = (...origins: Position[]): Cell[] =>
//       this.select(
//         (cell, _index, origins) =>
//           origins.some((origin) => cell.position.y === origin.y),
//         ...origins
//       );
//     this.selectTopEdge = () => this._cells.filter((cell) => cell.isTopEdge);
//     this.selectVerticalEdges = () =>
//       this._cells.filter((cell) => cell.isVerticalEdge);
//   }
// }
