import { ModeBase } from "./modes";

export class Scene extends ModeBase<Scene> {
  constructor(onUpdate: (onTransition: (nextMode: Scene) => void) => void) {
    super(onUpdate);
  }
}

class SceneBase<T extends Scene> extends Scene {
  constructor(onUpdate: (onTransition: (nextMode: T) => void) => void) {
    super(onUpdate);
  }
}

export class Level extends SceneBase<Level | PauseMenu | ResultsMenu> {
  constructor(
    onUpdate: (
      onTransition: (nextMode: Level | PauseMenu | ResultsMenu) => void
    ) => void
  ) {
    super(onUpdate);
  }
}

class Menu<T extends Scene> extends SceneBase<T> {
  constructor(onUpdate: (onTransition: (nextMode: T) => void) => void) {
    super(onUpdate);
  }
}

export class LobbyMenu extends Menu<Level | MainMenu> {
  constructor(
    onUpdate: (onTransition: (nextMode: Level | MainMenu) => void) => void
  ) {
    super(onUpdate);
  }
}

export class MainMenu extends Menu<LobbyMenu | SettingsMenu> {
  constructor(
    onUpdate: (
      onTransition: (nextMode: LobbyMenu | SettingsMenu) => void
    ) => void
  ) {
    super(onUpdate);
  }
}

class PauseMenu extends Menu<Level | ResultsMenu | SettingsMenu> {
  constructor(
    onUpdate: (
      onTransition: (nextMode: Level | ResultsMenu | SettingsMenu) => void
    ) => void
  ) {
    super(onUpdate);
  }
}

class ResultsMenu extends Menu<MainMenu> {
  constructor(onUpdate: (onTransition: (nextMode: MainMenu) => void) => void) {
    super(onUpdate);
  }
}

class SettingsMenu extends Menu<MainMenu | PauseMenu> {
  constructor(
    onUpdate: (onTransition: (nextMode: MainMenu | PauseMenu) => void) => void
  ) {
    super(onUpdate);
  }
}

export class SplashScene extends SceneBase<MainMenu> {
  constructor(onUpdate: (onTransition: (nextMode: MainMenu) => void) => void) {
    super(onUpdate);
  }
}
