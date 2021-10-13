import { Clock, ClockConfig } from "./clocks";

import { Roster } from "./agents";

export class Game {
  readonly clock: Clock;
  readonly roster: Roster;
  constructor({ clock: clockConfig }: { clock: ClockConfig }) {
    this.clock = new Clock(clockConfig);
    this.roster = new Roster();
  }
}
