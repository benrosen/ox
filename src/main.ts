import { Modal, ModeBase } from "./ox";

class Attacking extends ModeBase<Dead | Patrolling> {
  constructor() {
    super((onTransition: (nextMode: Dead | Patrolling) => void) => {
      console.log("update attacking state");
      onTransition(new Dead());
    });
  }
}

class Dead extends ModeBase<Patrolling> {
  constructor() {
    super(() => console.log("update dead state"));
  }
}

class Patrolling extends ModeBase<Dead | Pursuing> {
  constructor() {
    super((onTransition: (nextMode: Dead | Pursuing) => void) => {
      console.log("update patrolling state");
      onTransition(new Pursuing());
    });
  }
}

class Pursuing extends ModeBase<Attacking | Dead | Patrolling> {
  constructor() {
    super((onTransition: (nextMode: Attacking | Dead | Pursuing) => void) => {
      console.log("update pursuing state");
      onTransition(new Attacking());
    });
  }
}

export default () => {
  const modal = new Modal(new Patrolling());
  modal.update();
  modal.update();
  modal.update();
  modal.update();
};
