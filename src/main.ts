import { Grid } from "./ox";

export default () => {
  const g = new Grid({ x: 5, y: 5 });
  const x = g.selectBottomEdge();
  console.log(x);
};
