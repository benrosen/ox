import { Cell, Grid, ProtectedVariable, PublicTopic } from "./main";

describe("ox", () => {
  describe("`Cell`", () => {
    const grid = new Grid([3, 3], new ProtectedVariable(new PublicTopic()));
    describe("`.column`", () =>
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ]
        .map(
          (coordinates) =>
            Array.from(grid.cells).find(
              (cell) => cell.coordinates === coordinates
            )!
        )
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
      [
        [[0, 0], false],
        [[1, 1], false],
        [[2, 2], true],
      ]
        .map(
          ([coordinates, isCellOnBottomEdge]) =>
            [
              Array.from(grid.cells).find(
                (cell) => cell.coordinates === coordinates
              )!,
              isCellOnBottomEdge,
            ] as [Cell, boolean]
        )
        .forEach(([cell, isCellOnBottomEdge]) => {
          it("returns `true` if this cell is positioned on the bottom edge of its parent grid.", () =>
            expect(cell.isOnBottomEdge).toStrictEqual(isCellOnBottomEdge));
        }));

    // describe("`.isOnEdge`", () => {
    //   it("returns `true` if this cell is positioned on the top, right, bottom, or left edge of its parent grid.", () => {
    //     //
    //   });
    // });

    // describe("`.isOnHorizontalEdge`", () => {
    //   it("returns `true` if this cell is positioned on the top or bottom edge of its parent grid.", () => {
    //     //
    //   });
    // });

    // describe("`.isOnLeftEdge`", () => {
    //   it("returns `true` if this cell is positioned on the left edge of its parent grid.", () => {
    //     //
    //   });
    // });

    // describe("`.isOnRightEdge`", () => {
    //   it("returns `true` if this cell is positioned on the right edge of its parent grid.", () => {
    //     //
    //   });
    // });

    // describe("`.isOnTopEdge`", () => {
    //   it("returns `true` if this cell is positioned on the top edge of its parent grid.", () => {
    //     //
    //   });
    // });

    // describe("`.isOnVerticalEdge`", () => {
    //   it("returns `true` if this cell is positioned on the left or right edge of its parent grid.", () => {
    //     //
    //   });
    // });

    // describe("`.negativeDiagonal`", () => {
    //   it("returns the cells that share an `x` coordinate with this cell, including this cell.", () => {
    //     //
    //   });
    // });

    // describe("`.neighbors`", () => {
    //   it("returns the cells that share an `x` coordinate with this cell, including this cell.", () => {
    //     //
    //   });
    // });

    // describe("`.positiveDiagonal`", () => {
    //   it("returns the cells that share an `x` coordinate with this cell, including this cell.", () => {
    //     //
    //   });
    // });

    // describe("`.row`", () => {
    //   it("returns the cells that share an `x` coordinate with this cell, including this cell.", () => {
    //     //
    //   });
    // });

    // describe("`.tokens`", () => {
    //   it("returns the cells that share an `x` coordinate with this cell, including this cell.", () => {
    //     //
    //   });
    // });
  });
  //   describe("`getDifference`", () => {
  //     //
  //   });
  //   describe("`getSlope`", () => {
  //     //
  //   });
  //   describe("`Grid`", () => {
  //     //
  //   });
  //   describe("`isEven`", () => {
  //     //
  //   });
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
