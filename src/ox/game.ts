import { Clock } from "./clocks";
import { ClockConfig } from ".";
import { Roster } from "./players";

export class Game {
  clock: Clock;
  roster: Roster;
  constructor({ clock: clockConfig }: GameConfig) {
    this.clock = new Clock(clockConfig);
    this.roster = new Roster();
  }
}

export type GameConfig = { clock: ClockConfig };
