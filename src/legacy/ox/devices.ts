// import { Position } from ".";
// import { Suite } from "./events";

// export class Device extends Suite<Device> {
//   constructor() {
//     super(...Object.values(DeviceEvent));
//   }
// }

// class DeviceBase<T extends DeviceConfig> extends Device {
//   private readonly _config: T;
//   get config() {
//     return this._config;
//   }
//   constructor(config: T) {
//     super();
//     this._config = config;
//   }
// }

// type DeviceConfig = {
//   [key in DeviceTopic]?: any;
// };

// export enum DeviceEvent {
//   OnDownStart = "onDownStart",
//   OnDownStop = "onDownStop",
//   OnLeftStart = "onLeftStart",
//   OnLeftStop = "onLeftStop",
//   OnPrimaryStart = "onPrimaryStart",
//   OnPrimaryStop = "onPrimaryStop",
//   OnRightStart = "onRightStart",
//   OnRightStop = "onRightStop",
//   OnSecondaryStart = "onSecondaryStart",
//   OnSecondaryStop = "onSecondaryStop",
//   OnUpStart = "onUpStart",
//   OnUpStop = "onUpStop",
// }

// export enum DeviceTopic {
//   Down = "down",
//   Left = "left",
//   Primary = "primary",
//   Right = "right",
//   Secondary = "secondary",
//   Up = "up",
// }

// type DeviceTopicEventMap = { [key in DeviceTopic]: DeviceEvent };

// export class Keyboard extends DeviceBase<KeyboardConfig> {
//   constructor(config: KeyboardConfig) {
//     super(config);
//     const relayKeyEventAsDeviceEvent = (
//       keyEvent: KeyEvent,
//       deviceTopicEventMap: DeviceTopicEventMap
//     ) =>
//       document.addEventListener(
//         keyEvent,
//         (event) =>
//           !event.repeat &&
//           Object.entries(config).forEach(
//             ([topic, key]) =>
//               key === event.key &&
//               this.events[deviceTopicEventMap[topic as DeviceTopic]].publish({
//                 data: this,
//               })
//           )
//       );
//     relayKeyEventAsDeviceEvent(KeyEvent.OnKeyDown, {
//       [DeviceTopic.Down]: DeviceEvent.OnDownStart,
//       [DeviceTopic.Left]: DeviceEvent.OnLeftStart,
//       [DeviceTopic.Primary]: DeviceEvent.OnPrimaryStart,
//       [DeviceTopic.Right]: DeviceEvent.OnRightStart,
//       [DeviceTopic.Secondary]: DeviceEvent.OnSecondaryStart,
//       [DeviceTopic.Up]: DeviceEvent.OnUpStart,
//     });
//     relayKeyEventAsDeviceEvent(KeyEvent.OnKeyUp, {
//       [DeviceTopic.Down]: DeviceEvent.OnDownStop,
//       [DeviceTopic.Left]: DeviceEvent.OnLeftStop,
//       [DeviceTopic.Primary]: DeviceEvent.OnPrimaryStop,
//       [DeviceTopic.Right]: DeviceEvent.OnRightStop,
//       [DeviceTopic.Secondary]: DeviceEvent.OnSecondaryStop,
//       [DeviceTopic.Up]: DeviceEvent.OnUpStop,
//     });
//   }
// }

// type KeyboardConfig = DeviceConfig;

// enum KeyEvent {
//   OnKeyDown = "keydown",
//   OnKeyUp = "keyup",
// }

// // pointer emits events and has a position
// // gridpointer wraps points
// // math functions to clamp position within grid cells, e.g. (41,63)(100,100)(2,2) => (0, 1)
// // gridpointer emits events
// // onPointerEnter, onPointerExit, onPointerDown, onPointerUp

// export class Pointer extends DeviceBase<PointerConfig> {
//   private readonly _position: Position;
//   get position(): Position {
//     return this._position;
//   }
//   constructor(config: PointerConfig) {
//     super(config);
//   }
// }

// type PointerConfig = DeviceConfig;

// enum PointerEvent {
//   OnPointerDown = "pointerdown",
//   OnPointerMove = "pointermove",
//   OnPointerUp = "pointerup",
// }
