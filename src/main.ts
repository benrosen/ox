import { Grid } from "./ox";

export default () => {
  const grid = new Grid({ x: 5, y: 5 });
  console.log(grid.growSelection({ x: 0, y: 0 }));
};
