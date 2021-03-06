import {
  Cell,
  Grid,
  ProtectedVariable,
  PublicTopic,
  Token,
  getCellFromGridByCoordinates,
  getDifference,
  getSlope,
  isEven,
} from "./main";

const assert = <T, U>(
  assertions: [T, U][],
  name: string,
  onEvaluate: (value: T) => U,
  onMessage: (assertion: [T, U]) => string = ([input, expected]) =>
    `Returns ${expected} for ${input}.`
) =>
  describe(`\`${name}\``, () =>
    assertions.forEach((assertion) =>
      it(onMessage(assertion), () =>
        expect(onEvaluate(assertion[0])).toStrictEqual(assertion[1])
      )
    ));

describe("ox", () => {
  describe("`Cell`", () => {
    const setTokens = new PublicTopic<Set<Token>>();
    const tokens = new ProtectedVariable<Set<Token>>(setTokens);
    setTokens.publish(new Set());
    const grid = new Grid([3, 3], tokens);

    describe("`.column`", () =>
      (
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ] as [number, number][]
      )
        .map((coordinates) => getCellFromGridByCoordinates(coordinates, grid))
        .forEach((cell) => {
          it("returns a collection whose size equals the height of the cell's parent grid.", () =>
            expect(cell.column.size).toStrictEqual(cell.grid.dimensions[1]));
          it("returns only cells that share an `x` coordinate with this cell.", () =>
            expect(
              Array.from(cell.column).every(
                (columnCell) =>
                  columnCell.coordinates[0] === cell.coordinates[0]
              )
            ).toBeTruthy());
          it("returns a collection that contains this cell.", () =>
            expect(Array.from(cell.column).includes(cell)).toBeTruthy());
        }));

    describe("`.isOnBottomEdge`", () =>
      (
        [
          [[0, 0], false],
          [[1, 1], false],
          [[2, 2], true],
        ] as [[number, number], boolean][]
      )
        .map(
          ([coordinates, isCellOnBottomEdge]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              isCellOnBottomEdge,
            ] as [Cell, boolean]
        )
        .forEach(([cell, isCellOnBottomEdge]) => {
          it("returns `true` if this cell is positioned on the bottom edge of its parent grid.", () =>
            expect(cell.isOnBottomEdge).toStrictEqual(isCellOnBottomEdge));
        }));

    describe("`.isOnEdge`", () =>
      (
        [
          [[0, 0], true],
          [[0, 1], true],
          [[1, 1], false],
          [[2, 0], true],
          [[2, 1], true],
          [[2, 2], true],
        ] as [[number, number], boolean][]
      )
        .map(
          ([coordinates, isCellOnEdge]) =>
            [getCellFromGridByCoordinates(coordinates, grid), isCellOnEdge] as [
              Cell,
              boolean
            ]
        )
        .forEach(([cell, isCellOnEdge]) => {
          it("returns `true` if this cell is positioned on the top, right, bottom, or left edge of its parent grid.", () => {
            expect(cell.isOnEdge).toStrictEqual(isCellOnEdge);
          });
        }));

    describe("`.isOnHorizontalEdge`", () =>
      (
        [
          [[0, 0], true],
          [[0, 1], false],
          [[1, 1], false],
          [[2, 0], true],
          [[2, 1], false],
          [[2, 2], true],
        ] as [[number, number], boolean][]
      )
        .map(
          ([coordinates, isCellOnHorizontalEdge]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              isCellOnHorizontalEdge,
            ] as [Cell, boolean]
        )
        .forEach(([cell, isCellOnHorizontalEdge]) =>
          it("returns `true` if this cell is positioned on the top or bottom edge of its parent grid.", () => {
            expect(cell.isOnHorizontalEdge).toStrictEqual(
              isCellOnHorizontalEdge
            );
          })
        ));

    describe("`.isOnLeftEdge`", () =>
      (
        [
          [[0, 0], true],
          [[1, 1], false],
          [[2, 2], false],
        ] as [[number, number], boolean][]
      )
        .map(
          ([coordinates, isCellOnLeftEdge]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              isCellOnLeftEdge,
            ] as [Cell, boolean]
        )
        .forEach(([cell, isCellOnLeftEdge]) => {
          it("returns `true` if this cell is positioned on the left edge of its parent grid.", () =>
            expect(cell.isOnLeftEdge).toStrictEqual(isCellOnLeftEdge));
        }));

    describe("`.isOnRightEdge`", () =>
      (
        [
          [[0, 0], false],
          [[1, 1], false],
          [[2, 2], true],
        ] as [[number, number], boolean][]
      )
        .map(
          ([coordinates, isCellOnRightEdge]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              isCellOnRightEdge,
            ] as [Cell, boolean]
        )
        .forEach(([cell, isCellOnRightEdge]) => {
          it("returns `true` if this cell is positioned on the right edge of its parent grid.", () =>
            expect(cell.isOnRightEdge).toStrictEqual(isCellOnRightEdge));
        }));

    describe("`.isOnTopEdge`", () =>
      (
        [
          [[0, 0], true],
          [[1, 1], false],
          [[2, 2], false],
        ] as [[number, number], boolean][]
      )
        .map(
          ([coordinates, isCellOnTopEdge]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              isCellOnTopEdge,
            ] as [Cell, boolean]
        )
        .forEach(([cell, isCellOnTopEdge]) => {
          it("returns `true` if this cell is positioned on the bottom edge of its parent grid.", () =>
            expect(cell.isOnTopEdge).toStrictEqual(isCellOnTopEdge));
        }));

    describe("`.isOnVerticalEdge`", () =>
      (
        [
          [[0, 0], true],
          [[0, 1], true],
          [[1, 1], false],
          [[2, 0], true],
          [[2, 1], true],
          [[2, 2], true],
        ] as [[number, number], boolean][]
      )
        .map(
          ([coordinates, isCellOnVerticalEdge]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              isCellOnVerticalEdge,
            ] as [Cell, boolean]
        )
        .forEach(([cell, isCellOnVerticalEdge]) =>
          it("returns `true` if this cell is positioned on the top or bottom edge of its parent grid.", () => {
            expect(cell.isOnVerticalEdge).toStrictEqual(isCellOnVerticalEdge);
          })
        ));

    describe("`.negativeDiagonal`", () =>
      (
        [
          [[0, 0], [[0, 0]]],
          [
            [1, 1],
            [
              [0, 2],
              [1, 1],
              [2, 0],
            ],
          ],
          [
            [0, 2],
            [
              [0, 2],
              [1, 1],
              [2, 0],
            ],
          ],
        ] as [[number, number], [number, number][]][]
      )
        .map(
          ([coordinates, expectedCoordinates]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              expectedCoordinates,
            ] as [Cell, [number, number][]]
        )
        .forEach(([cell, expected]) =>
          it(`returns [${expected}] for  [${cell.coordinates}].`, () =>
            expect(
              Array.from(cell.negativeDiagonal).map((cell) => cell.coordinates)
            ).toStrictEqual(expected))
        ));

    // describe("`.neighbors`", () => {
    //   it("returns the cells that share an `x` coordinate with this cell, including this cell.", () => {
    //     //
    //   });
    // });

    describe("`.positiveDiagonal`", () =>
      (
        [
          [
            [0, 0],
            [
              [0, 0],
              [1, 1],
              [2, 2],
            ],
          ],
          [
            [1, 1],
            [
              [0, 0],
              [1, 1],
              [2, 2],
            ],
          ],
          [[0, 2], [[0, 2]]],
        ] as [[number, number], [number, number][]][]
      )
        .map(
          ([coordinates, expectedCoordinates]) =>
            [
              getCellFromGridByCoordinates(coordinates, grid),
              expectedCoordinates,
            ] as [Cell, [number, number][]]
        )
        .forEach(([cell, expected]) =>
          it(`returns [${expected}] for  [${cell.coordinates}].`, () =>
            expect(
              Array.from(cell.positiveDiagonal).map((cell) => cell.coordinates)
            ).toStrictEqual(expected))
        ));

    describe("`.row`", () =>
      (
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ] as [number, number][]
      )
        .map((coordinates) => getCellFromGridByCoordinates(coordinates, grid))
        .forEach((cell) => {
          it("returns a collection whose size equals the width of the cell's parent grid.", () =>
            expect(cell.row.size).toStrictEqual(cell.grid.dimensions[0]));
          it("returns only cells that share a `y` coordinate with this cell.", () =>
            expect(
              Array.from(cell.row).every(
                (rowCell) => rowCell.coordinates[1] === cell.coordinates[1]
              )
            ).toBeTruthy());
          it("returns a collection that contains this cell.", () =>
            expect(Array.from(cell.row).includes(cell)).toBeTruthy());
        }));

    // describe("`.tokens`", () => {
    //   it("returns the cells that share an `x` coordinate with this cell, including this cell.", () => {
    //     //
    //   });
    // });
  });

  // special function that requires Props derivative
  // generate tests from asser() and Props and assertions

  // generic test function takes inputs & expected outputs and evaluates

  // getMessage callback that returns a string
  //

  // describe("`getCellFromGridByCoordinates`", () => {
  //   [] as [[[number, number], Grid]][];
  // });

  assert(
    [
      [[new Set([0, 1, 2]), new Set([0, 1, 2])], new Set([])],
      [[new Set([0, 1, 2]), new Set([0])], new Set([1, 2])],
      [[new Set([0, 1]), new Set([0, 1, 2])], new Set([])],
    ] as [[Set<number>, Set<number>], Set<number>][],
    getDifference.name,
    ([a, b]) => getDifference<number>(a, b)
  );

  assert(
    [
      [
        [
          [0, 0],
          [0, 0],
        ],
        NaN,
      ],
      [
        [
          [0, 0],
          [0, 1],
        ],
        Infinity,
      ],
      [
        [
          [0, 0],
          [1, 0],
        ],
        0,
      ],
      [
        [
          [0, 0],
          [1, 1],
        ],
        1,
      ],
      [
        [
          [0, 0],
          [-1, 1],
        ],
        -1,
      ],
      [
        [
          [0, 0],
          [-1, -1],
        ],
        1,
      ],
      [
        [
          [0, 0],
          [1, -1],
        ],
        -1,
      ],
      [
        [
          [72, 55],
          [64, 37],
        ],
        2.25,
      ],
    ] as [[[number, number], [number, number]], number][],
    getSlope.name,
    ([a, b]) => getSlope(a, b)
  );

  assert(
    [
      [0, true],
      [1, false],
      [2, true],
    ],
    isEven.name,
    isEven
  );

  //   describe("`ProtectedTopic`", () => {
  //     //
  //   });

  //   describe("`ProtectedVariable`", () => {
  //     //
  //   });

  //   describe("`PublicTopic`", () => {
  //     //
  //   });

  //   describe("`PublicVariable`", () => {
  //     //
  //   });

  //   describe("`Token`", () => {
  //     //
  //   });
});
