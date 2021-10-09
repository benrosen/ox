import { Suite } from "./events";

type Url = string;

type Data<T> = CloseEvent | Event | MessageEvent<T>;

type Server = {
  protocols?: string[];
  url: Url;
};

export class Client<T> extends Suite<Data<T>> {
  constructor(server: Server) {
    super(...Object.values(ClientEvent));
    const websocket = new WebSocket(server.url, server.protocols);
    [
      {
        event: WebsocketEvent.OnClose,
        listener: (event: Data<T>) =>
          this.events.onClose.publish({ data: event }),
      },
      {
        event: WebsocketEvent.OnError,
        listener: (event: Data<T>) =>
          this.events.onError.publish({ data: event }),
      },
      {
        event: WebsocketEvent.OnMessage,
        listener: (event: Data<T>) =>
          this.events.onMessage.publish({ data: event }),
      },
      {
        event: WebsocketEvent.OnOpen,
        listener: (event: Data<T>) =>
          this.events.onOpen.publish({ data: event }),
      },
    ].forEach(({ event, listener }) =>
      websocket.addEventListener(event, listener)
    );
  }
}

enum ClientEvent {
  OnClose = "onClose",
  OnError = "onError",
  OnMessage = "onMessage",
  OnOpen = "onOpen",
}

enum WebsocketEvent {
  OnClose = "close",
  OnError = "error",
  OnMessage = "message",
  OnOpen = "open",
}
