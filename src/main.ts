import { clearInterval, setInterval, setTimeout } from "timers";

namespace ox {
  class Bus<T> {
    handlers: Handler<T, Data<T>, Event<T, Data<T>>>[];
    constructor() {
      this.handlers = [];
    }
    publish: Publisher<T, Data<T>, Event<T, Data<T>>> = (
      event: Event<T, Data<T>>
    ) => this.handlers.forEach((handler) => handler(event));
    subscribe: Subscriber<
      T,
      Data<T>,
      Event<T, Data<T>>,
      Handler<T, Data<T>, Event<T, Data<T>>>
    > = (handler: Handler<T, Data<T>, Event<T, Data<T>>>) => {
      const index = this.handlers.push(handler);
      return () => {
        this.handlers = this.handlers.splice(index, 1);
      };
    };
  }

  type Config = {
    //
  };

  // type Coordinates = { x: number; y: number };

  type Data<T> = T & {};

  type Event<T, U extends Data<T>> = { data: U };

  export class Game {
    clock: Clock;
    roster: Roster;
    constructor(config: Config) {
      console.log("config", config);
      this.clock = new Clock();
      this.roster = new Roster();
    }
  }

  // type Grid<T> = T[][];

  type Handler<T, U extends Data<T>, V extends Event<T, U>> = (
    event: V
  ) => void;

  interface Identifiable {
    id: Identifier;
  }

  type Identifier = string;

  class Player implements Identifiable {
    id: Identifier;
    input: Suite<Player>;
    constructor(playerId: string) {
      this.id = playerId;
      this.input = new Suite(...Object.values(PlayerInputEvent));
    }
  }

  enum PlayerInputEvent {
    OnStartPrimary = "onStartPrimary",
    OnStartSecondary = "onStartSecondary",
    OnStartMoveDown = "onStartMoveDown",
    OnStartMoveLeft = "onStartMoveLeft",
    OnStartMoveRight = "onStartMoveRight",
    OnStartMoveUp = "onStartMoveUp",
    OnStopPrimary = "onStopPrimary",
    OnStopSecondary = "onStopSecondary",
    OnStopMoveDown = "onStopMoveDown",
    OnStopMoveLeft = "onStopMoveLeft",
    OnStopMoveRight = "onStopMoveRight",
    OnStopMoveUp = "onStopMoveUp",
  }

  type Publisher<T, U extends Data<T>, V extends Event<T, U>> = (
    event: V
  ) => void;

  enum RosterEvent {
    OnPlayerCreated = "onPlayerAdded",
    OnPlayerDeleted = "onPlayerRemoved",
  }

  type Subscriber<
    T,
    U extends Data<T>,
    V extends Event<T, U>,
    W extends Handler<T, U, V>
  > = (handler: W) => () => void;

  class Suite<T> {
    events: { [key: string]: Bus<T> };
    constructor(...keys: string[]) {
      this.events = Object.fromEntries(keys.map((key) => [key, new Bus()]));
    }
  }

  class Roster extends Suite<Player> {
    private _players: Player[];
    constructor() {
      super(...Object.values(PlayerInputEvent), ...Object.values(RosterEvent));
      this._players = [];
    }
    add = (...playerIds: string[]) =>
      playerIds.forEach((playerId) => {
        const player = new Player(playerId);
        this._players.push(player);
        this.events.onPlayerAdded.publish({ data: player });
      });
    remove = (...playerIds: string[]) => {
      playerIds.forEach((playerId) => {
        this.events.onPlayerRemoved.publish({
          data: this._players.splice(
            this._players.findIndex((player) => player.id === playerId),
            1
          )[0],
        });
      });
    };
  }
  interface Counted {
    count: number;
  }

  type Range = { max: number; min: number };

  const clamp = (range: Range, value: number): number =>
    Math.min(Math.max(value, range.min), range.max);

  class Counter extends Suite<Counter> implements Counted {
    private _count: number = 0;
    private _range: Range;
    get count(): number {
      return this._count;
    }
    private set count(value: number) {
      this._count = clamp(this._range, value);
      this.events.onChange.publish({ data: this });
    }
    constructor(range: Range) {
      super(...Object.values(CounterEvent));
      this._count = range.min;
      this._range = range;
    }
    decrement = () => this.count--;
    increment = () => this.count++;
    reset = () => (this.count = this._range.min);
  }

  enum CounterEvent {
    OnChange = "onChange",
  }

  class Clock extends Suite<Clock> {
    private _counter: Counter;
    private _hertz: number;
    private _timer?: NodeJS.Timeout;
    private _unsubscribeFromOnChangeCounter: () => void = () => {};
    constructor(hertz: number = 60, range: Range = { max: Infinity, min: 0 }) {
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
      this._timer = setInterval(
        () => this._counter.increment(),
        1000 / this._hertz
      );
      this.events.onStart.publish({ data: this });
    };
    stop = () => {
      this._timer && clearInterval(this._timer);
      this._unsubscribeFromOnChangeCounter();
      this.events.onStop.publish({ data: this });
    };
  }

  enum ClockEvent {
    OnStart = "onStart",
    OnStop = "onStop",
    OnChange = "onChange",
  }
}

export default () => {
  const game = new ox.Game({});
  game.clock.events.onChange.subscribe((event) => console.log(event));
  game.roster.events.onPlayerAdded.subscribe((event) => console.log(event));
  game.roster.add("ben");
  game.clock.start();
  setTimeout(() => game.clock.stop(), 32);
};
