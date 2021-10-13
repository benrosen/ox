import { Clock, ClockConfig } from "./clocks";

import { Modal } from "./modes";
import { Roster } from "./agents";
import { Scene } from "./scenes";

export class Game {
  readonly clock: Clock;
  readonly roster: Roster;
  readonly sceneManager: Modal;
  constructor({
    clockConfig,
    initialScene,
  }: {
    clockConfig: ClockConfig;
    initialScene: Scene;
  }) {
    this.clock = new Clock(clockConfig);
    this.roster = new Roster();
    this.sceneManager = new Modal(initialScene);
    this.clock.events.onChange.subscribe(() => this.sceneManager.update());
  }
}
