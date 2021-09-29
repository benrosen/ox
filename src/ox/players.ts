import { Identifiable, Identifier } from "./identity";

import { Suite } from "./events";

export class Player implements Identifiable {
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

export class Roster extends Suite<Player> {
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

enum RosterEvent {
  OnPlayerCreated = "onPlayerAdded",
  OnPlayerDeleted = "onPlayerRemoved",
}
