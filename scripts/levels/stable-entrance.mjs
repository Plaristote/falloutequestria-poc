import {LevelBase} from "./base.mjs";

class Level extends LevelBase {
  onExit() {
    const accessComputer = level.findObject("access-computer");
    accessComputer.setVariable("enabled", true);
    super.onExit();
  }
}

export function create(model) {
  return new Level(model);
}
