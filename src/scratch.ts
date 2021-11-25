// // /**
// //  * ```
// // .d8888b. dP.  .dP
// // 88'  `88  `8bd8'
// // 88.  .88  .d88b.
// // `88888P' dP'  `dP
// //  * ```
// //  *
// //  * Ox is an experimental tool for building grid-based videogames.
// //  *
// //  * @module
// //  */

// // /** An object with methods to apply and revert a change. */
// // type Applicable = {
// //   /** Apply a change. */
// //   apply: () => void;
// //   /** Revert a previously applied change. */
// //   revert: () => void;
// // };

// // /** The minimum and maximum values of a range. */
// // type Bounds = { max: number; min: number };

// // /** Cells comprise grids. */
// // class Cell {
// //   /** The grid that contains this cell. */
// //   public readonly grid: Grid;
// //   /** Is this cell on the bottom edge of the grid? */
// //   public readonly isBottomEdge: boolean;
// //   /** Is this cell in the center of the grid? */
// //   public readonly isCenter: boolean;
// //   /** Is this cell on an edge of the grid? */
// //   public readonly isEdge: boolean;
// //   /** Is this cell on the top or bottom edge of the grid? */
// //   public readonly isHorizontalEdge: boolean;
// //   /** Is this cell on the left edge of the grid? */
// //   public readonly isLeftEdge: boolean;
// //   /** Is this cell on the right edge of the grid? */
// //   public readonly isRightEdge: boolean;
// //   /** Is this cell on the top edge of the grid? */
// //   public readonly isTopEdge: boolean;
// //   /** Is this cell on the left or right edge of the grid? */
// //   public readonly isVerticalEdge: boolean;
// //   /** The position of this cell. */
// //   public readonly position: Vector2;
// //   /** Return an array of cells that share an x coordinate with this cell. */
// //   public readonly selectColumn: () => Cell[];
// //   /** Return an array of cells that share a diagonal line with this cell. */
// //   public readonly selectDiagonal: (slope: Vector2) => Cell[];
// //   /** Return an array of neighboring cells. */
// //   public readonly selectNeighbors: () => Cell[];
// //   /** Return an array of cells that share a y coordinate with this cell. */
// //   public readonly selectRow: () => Cell[];
// //   /**
// //    * Create a cell
// //    * @param grid The grid that contains this cell.
// //    * @param position The position of this cell within its containing grid.
// //    */
// //   constructor(grid: Grid, position: Vector2) {
// //     this.grid = grid;
// //     this.isBottomEdge = position.y === grid.size.y - 1;
// //     this.isCenter = false; // is this cell in the center of the grid?
// //     this.isTopEdge = position.y === 0;
// //     this.isLeftEdge = position.x === 0;
// //     this.isRightEdge = position.x === grid.size.x - 1;
// //     this.isVerticalEdge = this.isLeftEdge || this.isRightEdge;
// //     this.isHorizontalEdge = this.isBottomEdge || this.isTopEdge;
// //     this.isEdge = this.isHorizontalEdge || this.isVerticalEdge;
// //     this.position = position;
// //     this.selectColumn = () => grid.selectColumns(position);
// //     this.selectDiagonal = (slope: Vector2) =>
// //       grid.selectDiagonals(slope, position);
// //     this.selectNeighbors = () =>
// //       grid.select(
// //         undefined,
// //         { x: position.x - 1, y: position.y - 1 },
// //         { x: position.x - 1, y: position.y },
// //         { x: position.x - 1, y: position.y + 1 },
// //         { x: position.x, y: position.y - 1 },
// //         { x: position.x, y: position.y + 1 },
// //         { x: position.x + 1, y: position.y - 1 },
// //         { x: position.x + 1, y: position.y },
// //         { x: position.x + 1, y: position.y + 1 }
// //       );
// //     this.selectRow = () => grid.selectRows(position);
// //   }
// // }

// // /** Changes can be applied to any type of object. */
// // class Change<T> implements Applicable {
// //   private _previousValue: T;
// //   /** Apply a new change to the state of an object. */
// //   public readonly apply: () => void;
// //   /** Revert an object to its previous state. */
// //   public readonly revert: () => void;
// //   /**
// //    * Create a change to the state of an object.
// //    * @param nextValue The target state.
// //    * @param onApply A callback function that applies the state change.
// //    * @param onSample A callback function that returns the current state.
// //    * @template T The type of value.
// //    */
// //   constructor(
// //     nextValue: T,
// //     onApply: (nextValue: T) => void,
// //     onSample: () => T
// //   ) {
// //     this._previousValue = onSample();
// //     this.apply = () => {
// //       this._previousValue = onSample();
// //       onApply(nextValue);
// //     };
// //     this.revert = () => onApply(this._previousValue);
// //   }
// // }

// // /** A history of changes that can be applied and reverted sequentially. */
// // class ChangeStack {
// //   private readonly _changes: Applicable[] = [];
// //   /**
// //    * Apply a new change to the state of an object.
// //    * @param value The change to apply.
// //    */
// //   public readonly push = (value: Applicable) =>
// //     this._changes[this._changes.push(value) - 1].apply();
// //   /** Revert an object to its previous state.  */
// //   public readonly pop = () => this._changes.pop()?.revert();
// // }

// // /** Clocks emit lifecycle events. */
// // class Clock {
// //   private readonly _counter: Counter;
// //   private readonly _hertz: number;
// //   private _timeout?: NodeJS.Timeout;
// //   private _unsubscribeFromOnChangeCounter: () => void = () => {};
// //   public get counter() {
// //     return this._counter;
// //   }
// //   /** Publish an event when the clock changes. */
// //   public readonly onChange = new Topic<Clock>();
// //   /** Publish an event when the clock starts. */
// //   public readonly onStart = new Topic<Clock>();
// //   /** Publish an event when the time stops. */
// //   public readonly onStop = new Topic<Clock>();
// //   /** Reset the clock to the minimum value in the range. */
// //   public readonly reset = () => this._counter.reset();
// //   /** Start changing the clock. */
// //   public readonly start = () => {
// //     this._unsubscribeFromOnChangeCounter = this._counter.onChange.subscribe(
// //       () => this.onChange.publish(this)
// //     );
// //     this._timeout = setInterval(
// //       () => this._counter.increment(),
// //       1000 / this._hertz
// //     );
// //     this.onStart.publish(this);
// //   };
// //   /** Stop changing the clock. */
// //   public readonly stop = () => {
// //     this._timeout && clearInterval(this._timeout);
// //     this._unsubscribeFromOnChangeCounter();
// //     this.onStop.publish(this);
// //   };
// //   /**
// //    * Create a clock.
// //    * @param doesLoop: Does the clock reset to the minimum value after it reaches the maximum value?
// //    * @param hertz The number of times per second to update the clock.
// //    * @param range The minimum and maximum limits on the value of this clock.
// //    */
// //   constructor(doesLoop: boolean, hertz: number, range: Bounds) {
// //     this._counter = new Counter(doesLoop, range);
// //     this._hertz = hertz;
// //   }
// // }

// // /** Players use controllers to create input events. */
// // type Controller = {
// //   /** Is the down control currently active? */
// //   isDownControlActive: Mutable<boolean>;
// //   /** Is the left control currently active? */
// //   isLeftControlActive: Mutable<boolean>;
// //   /** Is the primary control currently active? */
// //   isPrimaryControlActive: Mutable<boolean>;
// //   /** Is the right control currently active? */
// //   isRightControlActive: Mutable<boolean>;
// //   /** Is the secondary control currently active? */
// //   isSecondaryControlActive: Mutable<boolean>;
// //   /** Is the up control currently active? */
// //   isUpControlActive: Mutable<boolean>;
// // };

// // /** Count forwards and backwards within a range. */
// // class Counter {
// //   private readonly _count = new Mutable(0);
// //   private readonly _doesLoop: boolean;
// //   private readonly _range: Bounds;
// //   public get count() {
// //     return this._count.value;
// //   }
// //   private set count(value: number) {
// //     isValueInRange(this._range, value) && (this._count.value = value);
// //   }
// //   /** Decrease the count by one. */
// //   public readonly decrement = () =>
// //     this._doesLoop && this.count === this._range.min
// //       ? (this.count = this._range.max)
// //       : this.count--;
// //   /** Increase the count by one. */
// //   public readonly increment = () =>
// //     this._doesLoop && this.count === this._range.max
// //       ? (this.count = this._range.min)
// //       : this.count++;
// //   /** Publish an event when the count changes. */
// //   public readonly onChange = new Topic<number>();
// //   /** Reset the count to the minimum value in the range. */
// //   public readonly reset = () => (this.count = this._range.min);
// //   /** Undo the last change to the count. */
// //   public readonly undo = () => this._count.undo();
// //   /**
// //    * Create a Counter.
// //    * @param doesLoop Does the counter reset to the minimum value after it reaches the maximum value?
// //    * @param range The minimum and maximum limits of this Counter's count.
// //    */
// //   constructor(doesLoop: boolean, range: Bounds) {
// //     this._count.onChange.subscribe((event) =>
// //       this.onChange.publish(event.value)
// //     );
// //     this._doesLoop = doesLoop;
// //     this._range = range;
// //     this.reset();
// //   }
// // }

// // /** Navigate through a looping series. */
// // class Cycle<T> {
// //   /** Manages the current index state. */
// //   private readonly _counter: Counter;
// //   /** The array of items through which to cycle. */
// //   private readonly _items: T[];
// //   /** The current index. */
// //   public get index() {
// //     return this._counter.count;
// //   }
// //   /** The item at the current index. */
// //   public get item() {
// //     return this._items[this.index];
// //   }
// //   /** Advance to the next index. */
// //   public readonly advance = () =>
// //     this.isReversed ? this._counter.decrement() : this._counter.increment();
// //   /** Publish an event when the index changes. */
// //   public readonly onChange = new Topic<Cycle<T>>();
// //   /** Does the cycle advance backwards? */
// //   public isReversed = false;
// //   /**
// //    * Create a new cycle.
// //    * @param items The array of items through which to cycle.
// //    */
// //   constructor(...items: T[]) {
// //     this._counter = new Counter(true, {
// //       max: items.length - 1,
// //       min: 0,
// //     });
// //     this._items = items;
// //     this._counter.onChange.subscribe(() => this.onChange.publish(this));
// //   }
// // }

// // /** Calculate the slope between two points. */
// // const getSlope = (a: Vector2, b: Vector2) => ({ x: b.x - a.x, y: b.y - a.y });

// // /** Grids are made of cells. */
// // class Grid {
// //   /** The array of cells that comprise the grid. */
// //   private readonly _cells: Cell[] = [];
// //   /** Return an array of cells that includes the cells at the given positions and all neighboring cells. */
// //   public readonly growSelection: (...origins: Vector2[]) => Cell[];
// //   /** The width and height of the grid, measured in cells. */
// //   public readonly size: Vector2;
// //   /** Return an array of cells at the given positions. */
// //   public readonly select: (
// //     onFilter?: (cell: Cell, index: number, origins: Vector2[]) => boolean,
// //     ...origins: Vector2[]
// //   ) => Cell[];
// //   /** Return an array of all cells in the grid. */
// //   public readonly selectAll: () => Cell[];
// //   /** Return an array of arrays that group cells by x coordinate. */
// //   public readonly selectAllColumns: () => Cell[][];
// //   /** Return an array of arrays that group cells by y coordinate. */
// //   public readonly selectAllRows: () => Cell[][];
// //   /** Return an array of cells on the bottom edge of the grid. */
// //   public readonly selectBottomEdge: () => Cell[];
// //   /** Return an array of cells in the center of the grid. */
// //   public readonly selectCenter: () => Cell[];
// //   /** Return an array of cells that share an x coordinate with the given positions. */
// //   public readonly selectColumns: (...origins: Vector2[]) => Cell[];
// //   /** Return an array of cells that share a diagonal line with the given positions. */
// //   public readonly selectDiagonals: (
// //     slope: Vector2,
// //     ...origins: Vector2[]
// //   ) => Cell[];
// //   /** Return an array of cells on the edges of the grid. */
// //   public readonly selectEdges: () => Cell[];
// //   /** Return an array of cells on the top or bottom edge of the grid. */
// //   public readonly selectHorizontalEdges: () => Cell[];
// //   /** Return an array of cells on the left edge of the grid. */
// //   public readonly selectLeftEdge: () => Cell[];
// //   /** Return an array of cells on the right edge of the grid. */
// //   public readonly selectRightEdge: () => Cell[];
// //   /** Return an array of cells that share a y coordinate with the given positions. */
// //   public readonly selectRows: (...origins: Vector2[]) => Cell[];
// //   /** Return an array of cells on the top edge of the grid. */
// //   public readonly selectTopEdge: () => Cell[];
// //   /** Return an array of cells on the left or right edge of the grid. */
// //   public readonly selectVerticalEdges: () => Cell[];
// //   /**
// //    * Create a new grid.
// //    * @param size The width and height of the grid, measured in cells.
// //    */
// //   constructor(size: Vector2) {
// //     this.size = size;
// //     for (let x = 0; x < this.size.x; x++) {
// //       for (let y = 0; y < this.size.y; y++) {
// //         this._cells.push(new Cell(this, { x, y }));
// //       }
// //     }
// //     this.growSelection = (...origins: Vector2[]): Cell[] => [
// //       ...new Set(
// //         origins.flatMap((origin) => {
// //           const cell = this.select(undefined, origin)[0];
// //           return cell ? [cell, ...cell.selectNeighbors()] : [];
// //         })
// //       ),
// //     ];
// //     this.select = (
// //       onFilter?: (cell: Cell, index: number, origins: Vector2[]) => boolean,
// //       ...origins: Vector2[]
// //     ): Cell[] =>
// //       this._cells.filter((cell, index) =>
// //         onFilter
// //           ? onFilter(cell, index, origins)
// //           : origins.some(
// //               (origin) =>
// //                 origin.x === cell.position.x && origin.y === cell.position.y
// //             )
// //       );
// //     this.selectAll = () => this._cells;
// //     this.selectAllColumns = () =>
// //       [...Array(this.size.x).keys()].map((item) =>
// //         this.selectColumns({ x: item, y: 0 })
// //       );
// //     this.selectAllRows = () =>
// //       [...Array(this.size.y).keys()].map((item) =>
// //         this.selectColumns({ x: 0, y: item })
// //       );
// //     this.selectBottomEdge = () =>
// //       this._cells.filter((cell) => cell.isBottomEdge);
// //     this.selectCenter = () => this._cells.filter((cell) => cell.isCenter);
// //     // TODO use selectdiagonals for selectRow and selectColumn
// //     this.selectColumns = (...origins: Vector2[]): Cell[] =>
// //       this.select(
// //         (cell, _index, origins) =>
// //           origins.some((origin) => cell.position.x === origin.x),
// //         ...origins
// //       );
// //     // TODO rename selectDiagonals to selectBySlope or something
// //     this.selectDiagonals = (slope: Vector2, ...origins: Vector2[]) =>
// //       this._cells.filter((cell) =>
// //         origins.some((origin) => getSlope(origin, cell.position) === slope)
// //       );
// //     this.selectEdges = () => this._cells.filter((cell) => cell.isEdge);
// //     this.selectHorizontalEdges = () =>
// //       this._cells.filter((cell) => cell.isHorizontalEdge);
// //     this.selectLeftEdge = () => this._cells.filter((cell) => cell.isLeftEdge);
// //     this.selectRightEdge = () => this._cells.filter((cell) => cell.isRightEdge);
// //     // TODO use selectdiagonals for selectRow and selectColumn
// //     this.selectRows = (...origins: Vector2[]): Cell[] =>
// //       this.select(
// //         (cell, _index, origins) =>
// //           origins.some((origin) => cell.position.y === origin.y),
// //         ...origins
// //       );
// //     this.selectTopEdge = () => this._cells.filter((cell) => cell.isTopEdge);
// //     this.selectVerticalEdges = () =>
// //       this._cells.filter((cell) => cell.isVerticalEdge);
// //   }
// // }

// // /** Is the given value within the minimum and maximum limits of the given range? */
// // const isValueInRange = (range: Bounds, value: number): boolean =>
// //   value >= range.min && value <= range.max;

// // /** Mutable objects change state over time. */
// // class Mutable<T> {
// //   private readonly _history = new ChangeStack();
// //   private readonly _value: T;
// //   public get value(): T {
// //     return this._value;
// //   }
// //   public set value(nextValue: T) {
// //     this._history.push(
// //       new Change<T>(
// //         nextValue,
// //         (value: T) => value !== this.value && this.onChange.publish(value),
// //         () => this.value
// //       )
// //     );
// //   }
// //   /** Publish an event when the state of this object changes.
// //    * @todo publish {next: T, previous: T | undefined;}
// //    */
// //   public readonly onChange = new Topic<T>();
// //   /** Revert this object to its previous state. */
// //   public readonly undo = () => this._history.pop();
// //   /**
// //    * Create a mutable object.
// //    * @param value The initial value.
// //    * @template T The type of value.
// //    */
// //   constructor(value: T) {
// //     this._value = this.value = value;
// //   }
// // }

// // /** Occupants inhabit cells. */
// // class Occupant {
// //   /** The cell that contains this occupant. */
// //   public readonly cell: Mutable<Cell>;
// //   /**
// //    * Move this occupant by an amount.
// //    * @param directions A series of relative directional offsets.
// //    */
// //   public readonly moveBy = (...directions: Vector2[]) =>
// //     directions.forEach((direction) =>
// //       this.moveTo({
// //         x: direction.x + this.cell.value.position.x,
// //         y: direction.y + this.cell.value.position.y,
// //       })
// //     );
// //   /**
// //    * Move this occupant to a location.
// //    * @param positions A series of waypoints.
// //    */
// //   public readonly moveTo = (...positions: Vector2[]) =>
// //     positions.forEach(
// //       (position) =>
// //         (this.cell.value = this.cell.value.grid.select(undefined, position)[0])
// //     );
// //   /**
// //    * Create a new occupant.
// //    * @param cell The initial cell on which to place this occupant.
// //    */
// //   constructor(cell: Cell) {
// //     this.cell = new Mutable(cell);
// //   }
// // }

// // /** An event is a snapshot of an object's state. */
// // class Snapshot<T> {
// //   /** The time this snapshot was created, represented as the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC. */
// //   public readonly timestamp: number;
// //   /** The state of an object when this snapshot was created. */
// //   public readonly value: T;
// //   /**
// //    * Create a snapshot.
// //    * @param value The state of an object.
// //    * @template T The type object.
// //    */
// //   constructor(value: T) {
// //     this.timestamp = Date.now();
// //     this.value = value;
// //   }
// // }

// // /** Topics carry events from publishers to subscribers. */
// // class Topic<T> {
// //   private _handlers: ((event: Snapshot<T>) => void)[] = [];
// //   /**
// //    * Publish an event.
// //    * @param value The value to publish.
// //    * @template T The type of value.
// //    */
// //   public readonly publish = (value: T) =>
// //     this._handlers.forEach((handler) => handler(new Snapshot(value)));
// //   /**
// //    * Subscribe a callback function to this topic.
// //    * @param handler A callback function that handles published events.
// //    * @template T The type of value carried by the event.
// //    */
// //   public readonly subscribe = (handler: (event: Snapshot<T>) => void) => {
// //     const index = this._handlers.push(handler);
// //     return () => {
// //       this._handlers = this._handlers.splice(index, 1);
// //     };
// //   };
// // }

// // /** Useful for measuring position, direction, size, and more in two dimensional space. */
// // type Vector2 = { x: number; y: number };

// class TicTacToe {
//   public readonly grid: Grid;
//   public readonly occupants: Mutable<Occupant[]>;
//   public readonly focus: Occupant;
//   public readonly hasEvenWon: Mutable<boolean | null | undefined>;

//   constructor(controller: Controller) {
//     this.grid = new Grid({ x: 3, y: 3 });
//     this.occupants = new Mutable([] as Occupant[]);
//     this.focus = new Occupant(this.grid.select(undefined, { x: 0, y: 0 })[0]);
//     this.hasEvenWon = new Mutable<boolean | null | undefined>(undefined);

//     /** Move the focus occupant in response to controller directional events. */
//     (
//       [
//         [controller.isDownControlActive, { x: 0, y: -1 }],
//         [controller.isLeftControlActive, { x: -1, y: 0 }],
//         [controller.isRightControlActive, { x: 1, y: 0 }],
//         [controller.isUpControlActive, { x: 0, y: 1 }],
//       ] as [Mutable<boolean>, Vector2][]
//     ).forEach(([mutable, direction]) =>
//       mutable.onChange.subscribe(
//         (event) => event.value && this.focus.moveBy(direction)
//       )
//     );

//     /** Place an occupant on the currently focused cell if no occupant is present when the controller's primary input signal begins. */
//     controller.isPrimaryControlActive.onChange.subscribe(
//       (event) =>
//         event.value &&
//         this.hasEvenWon.value === undefined &&
//         this.occupants.value.find(
//           (occupant) => occupant.cell.value === this.focus.cell.value
//         ) === undefined &&
//         this.occupants.value.push(new Occupant(this.focus.cell.value))
//     );

//     /** Set the winner to true, false, null, or undefined whenever the state of the board changes. */
//     this.occupants.onChange.subscribe(
//       (event) =>
//         (this.hasEvenWon.value = [
//           ...this.grid.selectAllColumns(),
//           ...this.grid.selectAllRows(),
//           this.grid.selectDiagonals({ x: 1, y: 1 }, { x: 0, y: 0 }),
//           this.grid.selectDiagonals(
//             { x: 1, y: -1 },
//             { x: 0, y: this.grid.size.y }
//           ),
//         ].some((line) =>
//           line.every((cell) => {
//             const occupant = event.value.find(
//               (occupant) => occupant.cell.value === cell
//             );
//             return (
//               occupant &&
//               (event.value.indexOf(occupant) % 2 === 0) ===
//                 (event.value.length % 2 === 0)
//             );
//           })
//         )
//           ? event.value.length % 2 === 0
//           : event.value.length === 9
//           ? null
//           : undefined)
//     );
//   }
// }
