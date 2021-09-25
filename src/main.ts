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
    roster: Roster;
    constructor(config: Config) {
      console.log("config", config);
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
    players: Player[];
    constructor() {
      super(...Object.values(PlayerInputEvent), ...Object.values(RosterEvent));
      this.players = [];
    }
    add = (...playerIds: string[]) =>
      playerIds.forEach((playerId) => {
        const player = new Player(playerId);
        this.players.push(player);
        this.events.onPlayerAdded.publish({ data: player });
      });
    remove = (...playerIds: string[]) => {
      playerIds.forEach((playerId) => {
        this.events.onPlayerRemoved.publish({
          data: this.players.splice(
            this.players.findIndex((player) => player.id === playerId),
            1
          )[0],
        });
      });
    };
  }
}

export default () => {
  const game = new ox.Game({});
  game.roster.events.onPlayerAdded.subscribe((event) => console.log(event));
  game.roster.add("ben");
};
