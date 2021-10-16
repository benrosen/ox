import { Suite } from "./events";

type Change = {
  apply: () => void;
  revert: () => void;
};

class Changeset {
  private _changes: Change[] = [];
  push = (value: Change) =>
    this._changes[this._changes.push(value) - 1].apply();
  pop = () => this._changes.pop()?.revert();
}

export class Mutable<T> extends Suite<T> {
  private _changes: Changeset;
  private _state: T;
  public get state(): T {
    return this._state;
  }
  public set state(nextState: T) {
    this._changes.push(
      new Mutation<T>(
        nextState,
        (state: T) =>
          state !== this.state &&
          this.events.onChange.publish({ data: (this._state = state) }),
        () => this.state
      )
    );
  }
  constructor(initialValue: T) {
    super(...Object.values(MutableEvent));
    this._changes = new Changeset();
    this._state = this.state = initialValue;
  }
  undo = () => this._changes.pop();
}

enum MutableEvent {
  OnChange = "onChange",
}

class Mutation<T> implements Change {
  private _priorState: T;
  apply: () => void;
  revert: () => void;
  constructor(
    nextState: T,
    onApply: (nextState: T) => void,
    onSample: () => T
  ) {
    this._priorState = onSample();
    this.apply = () => {
      this._priorState = onSample();
      onApply(nextState);
    };
    this.revert = () => onApply(this._priorState);
  }
}
