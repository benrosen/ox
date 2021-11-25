// import { Mutable, contains } from ".";

// import { Range } from "./math";
// import { Suite } from "./events";

// export class Counter extends Suite<Counter> {
//   private _count: Mutable<number> = new Mutable(0);
//   private _range: Range;
//   get count(): number {
//     return this._count.state;
//   }
//   private set count(value: number) {
//     contains(this._range, value) && (this._count.state = value);
//   }
//   constructor(range: Range) {
//     super(...Object.values(CounterEvent));
//     this._count.events.onChange.subscribe(() =>
//       this.events.onChange.publish({ data: this })
//     );
//     this._count.state = range.min;
//     this._range = range;
//   }
//   decrement = () => this.count--;
//   increment = () => this.count++;
//   reset = () => (this.count = this._range.min);
//   undo = () => this._count.undo();
// }

// enum CounterEvent {
//   OnChange = "onChange",
// }
