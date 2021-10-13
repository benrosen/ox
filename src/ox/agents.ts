import { Device, DeviceEvent } from "./devices";
import { Identifiable, Identifier, createIdentifier } from "./identity";

import { Client } from "./network";
import { Mutable } from "./changes";
import { Suite } from "./events";

class Agent extends Suite<Agent> implements Identifiable {
  readonly id: Identifier;
  constructor(id?: Identifier) {
    super(...Object.values(AgentEvent));
    this.id = id ?? createIdentifier();
  }
}

enum AgentEvent {
  OnDownStart = "onDownStart",
  OnDownStop = "onDownStop",
  OnLeftStart = "onLeftStart",
  OnLeftStop = "onLeftStop",
  OnPrimaryStart = "onPrimaryStart",
  OnPrimaryStop = "onPrimaryStop",
  OnRightStart = "onRightStart",
  OnRightStop = "onRightStop",
  OnSecondaryStart = "onSecondaryStart",
  OnSecondaryStop = "onSecondaryStop",
  OnUpStart = "onUpStart",
  OnUpStop = "onUpStop",
}

class LocalAgent extends Agent {
  readonly device: Mutable<Device>;
  constructor(device: Device, id?: Identifier) {
    super(id);
    this.device = new Mutable(device);
    Object.values(DeviceEvent).forEach((deviceEvent) =>
      this.device.state.events[deviceEvent].subscribe(() =>
        this.events[deviceEvent].publish({ data: this })
      )
    );
  }
}

class RemoteAgent extends Agent {
  constructor(client: Client, id?: Identifier) {
    super(id);
    client.events.onMessage.subscribe((event) => {
      // subscribe to client events and fire agent events accordingly
      console.log(event);
    });
  }
}

export class Roster extends Suite<Agent> {
  private readonly _agents: Agent[] = [];
  readonly addLocalAgent: (device: Device, id?: Identifier) => void;
  readonly addRemoteAgent: (client: Client, id?: Identifier) => void;
  readonly removeAgent: (id: Identifier) => void;
  constructor() {
    super(...Object.values(RosterEvent));
    const addAgent = <T extends Agent>(agent: T) =>
      this.events.onAgentAdded.publish({
        data: this._agents[this._agents.push(agent)],
      });
    this.addLocalAgent = (device, id) => addAgent(new LocalAgent(device, id));
    this.addRemoteAgent = (client, id) => addAgent(new RemoteAgent(client, id));
    this.removeAgent = <T extends Agent>(id: Identifier) =>
      this.events.onAgentRemoved.publish({
        data: this._agents.splice(
          this._agents.findIndex((agent) => agent.id === id)
        )[0] as T,
      });
  }
}

enum RosterEvent {
  OnAgentAdded = "onAgentAdded",
  OnAgentRemoved = "onAgentRemoved",
  OnChange = "onChange",
}
