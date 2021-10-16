/**
 *  .d88b.  db    db
 * .8P  Y8. `8b  d8'
 * 88    88  `8bd8'
 * 88    88  .dPYb.
 * `8b  d8' .8P  Y8.
 *  `Y88P'  YP    YP
 *
 * ©2021 Ben Rosen | github.com/benrosen
 *
 * Ox is an experimental, opinionated tool for creating grid-based games.
 */

/**
 * Tools for creating grid-based games.
 */
namespace ox {
  //   class Agent {}

  /**
   * Facilitates event publishing and subscription management.
   *
   * @template T The type of data carried by events of this topic.
   */
  class Topic<T> {
    /**
     * A collection of callback functions that handle events for this topic.
     */
    private handlers: Handler<T, Data<T>, Event<T, Data<T>>>[] = [];

    /**
     * Pass the given event to every subscribed event handler.
     *
     * @param event An event to handle.
     */
    public publish: Publisher<T, Data<T>, Event<T, Data<T>>> = (
      event: Event<T, Data<T>>
    ) => this.handlers.forEach((handler) => handler(event));

    /**
     * Subscribe the given event handler to future events.
     *
     * @param handler A callback function that handles events.
     * @returns A callback function to unsubscribe the newly subscribed handler.
     */
    public subscribe: Subscriber<
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

  //   class Gamepad {}

  type Data<T> = T & {};

  type Event<T, U extends Data<T>> = { data: U };

  type Handler<T, U extends Data<T>, V extends Event<T, U>> = (
    event: V
  ) => void;

  //   class Game {}

  //   class Keyboard {}

  //   class LocalAgent {}

  type Publisher<T, U extends Data<T>, V extends Event<T, U>> = (
    event: V
  ) => void;

  //   class Pointer {}

  //   class ProceduralAgent {}

  //   class RemoteAgent {}

  //   class Roster {}

  type Subscriber<
    T,
    U extends Data<T>,
    V extends Event<T, U>,
    W extends Handler<T, U, V>
  > = (handler: W) => () => void;
}
