import { Counter } from "./counters";
import { Range } from "./math";
import { Suite } from "./events";

export class Clock extends Suite<Clock> {
  private _counter: Counter;
  get counter(): Counter {
    return this._counter;
  }
  private _hertz: number;
  private _timeout?: NodeJS.Timeout;
  private _unsubscribeFromOnChangeCounter: () => void = () => {};
  constructor({ hertz, range }: ClockConfig) {
    super(...Object.values(ClockEvent));
    this._counter = new Counter(range);
    this._hertz = hertz;
  }
  reset = () => this._counter.reset();
  start = () => {
    this._unsubscribeFromOnChangeCounter =
      this._counter.events.onChange.subscribe(() =>
        this.events.onChange.publish({ data: this })
      );
    this._timeout = setInterval(
      () => this._counter.increment(),
      1000 / this._hertz
    );
    this.events.onStart.publish({ data: this });
  };
  stop = () => {
    this._timeout && clearInterval(this._timeout);
    this._unsubscribeFromOnChangeCounter();
    this.events.onStop.publish({ data: this });
  };
}

export type ClockConfig = {
  hertz: number;
  range: Range;
};

enum ClockEvent {
  OnStart = "onStart",
  OnStop = "onStop",
  OnChange = "onChange",
}
