/**
 * ```
.d8888b. dP.  .dP
88'  `88  `8bd8'
88.  .88  .d88b.
`88888P' dP'  `dP
 * ```
 *
 * Ox is an experimental tool for building grid-based videogames.
 *
 * @module
 */

/**
 * Cells are the atomic building blocks of {@linkcode Grid} objects.
 */
export class Cell {
  /** Cells that share an `x` coordinate with this cell, including this cell. */
  public readonly column: Set<Cell>;

  /** The `x` and `y` position of this cell within its parent {@linkcode Grid}, with `coordinates[0]` representing the `x` position and `coordinates[1]` representing the `y` position. */
  public readonly coordinates: [number, number];

  /** The {@linkcode Grid} to which this cell belongs. */
  public readonly grid: Grid;

  /** Is this cell positioned on the bottom edge of its parent {@linkcode Grid}? */
  public readonly isOnBottomEdge: boolean;

  /** Is this cell positioned on the top, left, bottom, or right edge of its parent {@linkcode Grid}? */
  public readonly isOnEdge: boolean;

  /** Is this cell positioned on either the top or bottom edge of its parent {@linkcode Grid}? */
  public readonly isOnHorizontalEdge: boolean;

  /** Is this cell positioned on the left edge of its parent {@linkcode Grid}? */
  public readonly isOnLeftEdge: boolean;

  /** Is this cell positioned on the right edge of its parent {@linkcode Grid}? */
  public readonly isOnRightEdge: boolean;

  /** Is this cell positioned on the top edge of its parent {@linkcode Grid}? */
  public readonly isOnTopEdge: boolean;

  /** Is this cell positioned on either the left or right edge of its parent {@linkcode Grid}? */
  public readonly isOnVerticalEdge: boolean;

  /** Cells that share a descending diagonal line with this cell. */
  public readonly negativeDiagonal: Set<Cell>;

  /** Cells that share a border with this cell. */
  public readonly neighbors: Set<Cell>;

  /** Cells that share an ascending diagonal line with this cell. */
  public readonly positiveDiagonal: Set<Cell>;

  /** Cells that share a `y` coordinate with this cell, including this cell. */
  public readonly row: Set<Cell>;

  /** The {@linkcode Token} objects that are currently positioned on this cell.  */
  public readonly tokens: ProtectedVariable<Set<Token>>;

  /**
   * @param coordinates The `x` and `y` position of this cell within its parent {@linkcode Grid}, with `coordinates[0]` representing the `x` position and `coordinates[1]` representing the `y` position.
   * @param grid The {@linkcode Grid} to which this cell belongs.
   * @param tokens The {@linkcode Token} objects that are currently positioned on this cell.
   */
  constructor(
    coordinates: [number, number],
    grid: Grid,
    tokens: ProtectedVariable<Set<Token>>
  ) {
    this.coordinates = coordinates;
    this.grid = grid;
    this.column = new Set(
      Array.from(this.grid.columns).find((column) =>
        Array.from(column).includes(this)
      )
    );
    this.isOnBottomEdge = this.coordinates[1] === this.grid.dimensions[1] - 1;
    this.isOnLeftEdge = this.coordinates[0] === 0;
    this.isOnRightEdge = this.coordinates[0] === this.grid.dimensions[0] - 1;
    this.isOnTopEdge = this.coordinates[1] === 0;
    this.isOnHorizontalEdge = this.isOnTopEdge || this.isOnBottomEdge;
    this.isOnVerticalEdge = this.isOnLeftEdge || this.isOnRightEdge;
    this.isOnEdge = this.isOnHorizontalEdge || this.isOnVerticalEdge;
    this.negativeDiagonal = new Set(
      Array.from(this.grid.cells).filter(
        (cell) => getSlope(this.coordinates, cell.coordinates) === -1
      )
    );
    this.neighbors = new Set(
      Array.from(this.grid.cells).filter((cell) =>
        [
          [this.coordinates[0] - 1, this.coordinates[1] - 1],
          [this.coordinates[0] - 1, this.coordinates[1]],
          [this.coordinates[0] - 1, this.coordinates[1] + 1],
          [this.coordinates[0], this.coordinates[1] - 1],
          [this.coordinates[0], this.coordinates[1] + 1],
          [this.coordinates[0] + 1, this.coordinates[1] - 1],
          [this.coordinates[0] + 1, this.coordinates[1]],
          [this.coordinates[0] + 1, this.coordinates[1] + 1],
        ].includes(cell.coordinates)
      )
    );
    this.positiveDiagonal = new Set(
      Array.from(this.grid.cells).filter(
        (cell) => getSlope(this.coordinates, cell.coordinates) === 1
      )
    );
    this.row = new Set(
      Array.from(this.grid.rows).find((row) => Array.from(row).includes(this))
    );
    this.tokens = tokens;
  }
}

/**
 * Get items from the first `Set` that are not included in the second `Set`.
 * @param a The first `Set`
 * @param b The second `Set`
 * @returns Items from the first `Set` that are not included in the second `Set`.
 */
const getDifference = <T>(a: Set<T>, b: Set<T>) =>
  new Set(Array.from(a).filter((item) => !Array.from(b).includes(item)));

/**
 * Calculate the slope between two points in two-dimensional space, with each point represented as a tuple of two numbers.
 * @param a The first point, , with `a[0]` representing the `x` position and `a[1]` representing the `y` position.
 * @param b The first point, , with `b[0]` representing the `x` position and `b[1]` representing the `y` position.
 * @returns The slope between the given points.
 */
const getSlope = (a: [number, number], b: [number, number]) =>
  b[0] - a[0] / b[1] - a[1];

/**
 * A two-dimensional structure of {@linkcode Cell} objects arranged into rows and columns.
 */
export class Grid {
  /**
   * The size of the grid, with `dimensions[0]` representing the width of the grid and `dimensions[1]` representing the height of the grid.
   */
  public readonly dimensions: [number, number];

  /**
   * The cells that comprise this grid.
   */
  public readonly cells = new Set<Cell>();

  /**
   * The cells that comprise this grid, grouped into columns.
   */
  public readonly columns: Set<Set<Cell>>;

  /**
   * The cells that comprise this grid, grouped into rows.
   */
  public readonly rows: Set<Set<Cell>>;

  /**
   * The {@linkcode Token} objects that are currently positioned on this grid.
   */
  public readonly tokens: ProtectedVariable<Set<Token>>;

  /**
   * Cells on the bottom edge of this grid.
   */
  public readonly bottomEdge = new Set(
    Array.from(this.cells).filter((cell) => cell.isOnBottomEdge)
  );

  /**
   * Cells on the left edge of this grid.
   */
  public readonly leftEdge = new Set(
    Array.from(this.cells).filter((cell) => cell.isOnLeftEdge)
  );

  /**
   * Cells on the right edge of this grid.
   */
  public readonly rightEdge = new Set(
    Array.from(this.cells).filter((cell) => cell.isOnRightEdge)
  );

  /**
   * Cells on the top edge of this grid.
   */
  public readonly topEdge = new Set(
    Array.from(this.cells).filter((cell) => cell.isOnTopEdge)
  );

  /**
   * The top and bottom edges of this grid.
   */
  public readonly horizontalEdges = new Set([this.bottomEdge, this.topEdge]);

  /**
   * The left and right edges of this grid.
   */
  public readonly verticalEdges = new Set([this.leftEdge, this.rightEdge]);

  /**
   * The {@linkcode Cell} objects that are positioned on the top, left, bottom, and right edge of this grid.
   */
  public readonly edges = new Set([
    this.topEdge,
    this.rightEdge,
    this.bottomEdge,
    this.leftEdge,
  ]);

  /**
   * @param dimensions The size of the grid, with `dimensions[0]` representing the width of the grid and `dimensions[1]` representing the height of the grid.
   * @param tokenSource The {@linkcode Token} objects that may be positioned on this grid.
   */
  constructor(
    dimensions: [number, number],
    tokenSource: ProtectedVariable<Set<Token>>
  ) {
    this.dimensions = dimensions;
    this.columns = new Set(
      [...Array(this.dimensions[1]).keys()].map(
        (index) =>
          new Set(
            Array.from(this.cells).filter(
              (cell) => cell.coordinates[1] === index
            )
          )
      )
    );
    this.rows = new Set(
      [...Array(this.dimensions[0]).keys()].map(
        (index) =>
          new Set(
            Array.from(this.cells).filter(
              (cell) => cell.coordinates[0] === index
            )
          )
      )
    );
    this.tokens = tokenSource;
    for (let x = 0; x < this.dimensions[0]; x++) {
      for (let y = 0; y < this.dimensions[1]; y++) {
        const onCellTokensChanging = new PublicTopic<Set<Token>>();
        const cell = new Cell(
          [x, y],
          this,
          new ProtectedVariable<Set<Token>>(onCellTokensChanging)
        );
        this.cells.add(cell);
        this.tokens.onChange.subscribe(([previous, next]) => {
          getDifference(next, previous).forEach(
            (newToken) =>
              newToken.cell.value === cell &&
              onCellTokensChanging.publish(
                new Set([...cell.tokens.value, newToken])
              )
          );
          getDifference(previous, next).forEach(
            (oldToken) =>
              oldToken.cell.value === cell &&
              onCellTokensChanging.publish(
                new Set(
                  Array.from(cell.tokens.value).filter(
                    (token) => token !== oldToken
                  )
                )
              )
          );
        });
      }
    }
    const onTokensChanging = new PublicTopic<Set<Token>>();
    const addToken = (token: Token) =>
      onTokensChanging.publish(new Set([...this.tokens.value, token]));
    const removeToken = (token: Token) =>
      onTokensChanging.publish(
        new Set(
          Array.from(this.tokens.value).filter(
            (existingToken) => existingToken !== token
          )
        )
      );
    const onTokenCellChange = (cell: Cell | undefined, token: Token) =>
      cell?.grid !== this && removeToken(token);
    this.tokens = new ProtectedVariable(onTokensChanging);
    this.tokens.onChange.subscribe(([previous, next]) => {
      getDifference(next, previous).forEach((newToken) =>
        newToken.cell.onChange.subscribe(([, next]) =>
          onTokenCellChange(next, newToken)
        )
      );
      getDifference(previous, next).forEach((oldToken) =>
        oldToken.cell.onChange.unsubscribe(([, next]) =>
          onTokenCellChange(next, oldToken)
        )
      );
    });
    tokenSource.onChange.subscribe(([previous, next]) => {
      getDifference(next, previous).forEach(
        (newToken) => newToken.cell.value?.grid === this && addToken(newToken)
      );
      getDifference(previous, next).forEach((oldToken) =>
        removeToken(oldToken)
      );
    });
    tokenSource.value.forEach(
      (token) => token.cell.value?.grid === this && addToken(token)
    );
  }
}

/**
 * Is the provided number even?
 * @param value The value whose parity to evaluate.
 * @returns True if the provided value is even, otherwise false.
 */
export const isEven = (value: number): boolean => value % 2 === 0;

/**
 * Transmits messages from a pre-defined publisher to a dynamic collection of subscribers.
 */
class ProtectedTopic<T> {
  private readonly _topic = new PublicTopic<T>();

  /**
   * Subscribe to new messages on this topic.
   * @param subscriber A callback function to handle new messages.
   */
  public readonly subscribe = (subscriber: (value: T) => void) =>
    this._topic.subscribe(subscriber);

  /**
   * Unsubscribe from new messages on this topic.
   * @param subscriber A callback function to handle new messages.
   */
  public readonly unsubscribe = (subscriber: (value: T) => void) =>
    this._topic.unsubscribe(subscriber);

  /**
   * @param topic The public trigger for this protected topic.
   */
  constructor(topic: PublicTopic<T>) {
    topic.subscribe((value) => this._topic.publish(value));
  }
}

/**
 * A generic observable value with `undo()` and `redo()` methods whose value is set by a pre-defined topic.
 */
export class ProtectedVariable<T> {
  /**
   * A historical record of this variable's values.
   */
  private _history: T[] = [];

  /**
   * The index of the currently active value in this variable's history.
   */
  private _index: number = 0;

  /**
   * Publishes old and new values when this variable's value should be changed.
   */
  private readonly _onValueChanging = new PublicTopic<[T, T]>();

  protected set _value(value: T) {
    const previousValue = this.value;
    this._history = [...this._history.slice(0, this._index + 1), value];
    this._index = this._history.length - 1;
    this._onValueChanging.publish([previousValue, this.value]);
  }

  /**
   * Publishes old and new values when this variable's value changes.
   */
  public readonly onChange: ProtectedTopic<[T, T]>;

  /**
   * Revert the last undo operation.
   */
  public readonly redo = () =>
    this._index < this._history.length - 1 &&
    this._index++ &&
    this._onValueChanging.publish([this._history[this._index - 1], this.value]);

  /**
   * Revert this variable to its previous value.
   */
  public readonly undo = () =>
    this._index > 0 &&
    this._index-- &&
    this._onValueChanging.publish([this.value, this._history[this._index + 1]]);

  /**
   * The current value of this variable.
   */
  public get value(): T {
    return this._history[this._index];
  }

  /**
   * @param topic The public trigger for this protected variable.
   */
  constructor(topic: PublicTopic<T>) {
    topic.subscribe((value) => (this._value = value));
    this.onChange = new ProtectedTopic(this._onValueChanging);
  }
}

/**
 * Publish messages to a dynamic collection of subscribers.
 */
export class PublicTopic<T> {
  /**
   * Publish a value to subscribers of this topic.
   * @param value The value to publish to subscribers of this topic.
   */
  public readonly publish: (value: T) => void;

  /**
   * Subscribe to new messages on this topic.
   * @param subscriber A callback function to handle new messages.
   */
  public readonly subscribe: (subscriber: (value: T) => void) => void;

  /**
   * The callback functions that are subscribed to this topic.
   */
  private _subscribers: Set<(value: T) => void>;

  /**
   * Unsubscribe from new messages on this topic.
   * @param subscriber A callback function to handle new messages.
   */
  public readonly unsubscribe: (subscriber: (value: T) => void) => void;

  constructor() {
    this._subscribers = new Set<(value: T) => void>();
    this.publish = (value: T) =>
      this._subscribers.forEach((subscriber) => subscriber(value));
    this.subscribe = (subscriber: (value: T) => void) =>
      (this._subscribers = new Set([...this._subscribers, subscriber]));
    this.unsubscribe = (oldSubscriber: (value: T) => void) =>
      (this._subscribers = new Set(
        Array.from(this._subscribers).filter(
          (subscriber) => subscriber !== oldSubscriber
        )
      ));
  }
}

/**
 * A generic observable value with undo() and redo() methods.
 */
class PublicVariable<T> extends ProtectedVariable<T> {
  /**
   * Publishes old and new values when this variable's value should be changed.
   */
  private readonly _onChanging: PublicTopic<T>;

  /**
   * The current value of this variable.
   */
  public set value(value: T) {
    this._onChanging.publish(value);
  }

  constructor() {
    const onChanging = new PublicTopic<T>();
    super(onChanging);
    this._onChanging = onChanging;
  }
}

/**
 * Tokens may be associated with a {@linkcode Cell}.
 */
abstract class Token {
  /**
   * The {@linkcode Cell} on which this token is positioned.
   */
  public readonly cell = new PublicVariable<Cell | undefined>();
}
