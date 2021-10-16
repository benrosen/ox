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

export type Data<T> = T & {};

export type Event<T, U extends Data<T>> = { data: U };

type Handler<T, U extends Data<T>, V extends Event<T, U>> = (event: V) => void;

type Publisher<T, U extends Data<T>, V extends Event<T, U>> = (
  event: V
) => void;

type Subscriber<
  T,
  U extends Data<T>,
  V extends Event<T, U>,
  W extends Handler<T, U, V>
> = (handler: W) => () => void;

export class Suite<T> {
  events: { [key: string]: Bus<T> };
  constructor(...keys: string[]) {
    this.events = Object.fromEntries(keys.map((key) => [key, new Bus()]));
  }
}
