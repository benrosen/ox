// import { Data, Event } from ".";

// import { Mutable } from "./changes";
// import { Suite } from "./events";

// export class Modal extends Suite<Modal> {
//   private _mode: Mutable<Mode>;
//   private _unsubscribeFromOnTransitionMode: () => void = () => {};
//   constructor(initialMode: Mode) {
//     super(...Object.values(ModalEvent));
//     const onChangeMode = (event: Event<Mode, Data<Mode>>) => {
//       const { onStart, onTransition } = event.data.events;
//       this._unsubscribeFromOnTransitionMode = onTransition.subscribe(
//         (event) => {
//           this._unsubscribeFromOnTransitionMode();
//           this._mode.state = event.data as Mode;
//         }
//       );
//       onStart.publish({ data: event.data });
//     };
//     onChangeMode({ data: initialMode });
//     this._mode = new Mutable<Mode>(initialMode);
//     this._mode.events.onChange.subscribe(onChangeMode);
//   }
//   update = () =>
//     this._mode.state.events.onUpdate.publish({ data: this._mode.state });
// }

// enum ModalEvent {
//   OnChange = "onChange",
// }

// export class Mode extends Suite<Mode> {
//   constructor() {
//     super(...Object.values(ModeEvent));
//   }
// }

// export class ModeBase<T extends Mode> extends Mode {
//   constructor(onUpdate: (onTransition: (nextMode: T) => void) => void) {
//     super();
//     this.events.onUpdate.subscribe(() =>
//       onUpdate((nextMode: T) =>
//         this.events.onTransition.publish({ data: nextMode })
//       )
//     );
//   }
// }

// enum ModeEvent {
//   OnStart = "onStart",
//   OnTransition = "onTransition",
//   OnUpdate = "onUpdate",
// }
