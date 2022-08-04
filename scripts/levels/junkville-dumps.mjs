import {LevelBase} from "./base.mjs";
import {createRathianInstance, getRathian} from "../pnjs/rathian/template.mjs";

export class JunkvilleDumps extends LevelBase {
  onLoaded() {
    if (game.getVariable("rathianGoingToDumps") === 2) {
      const rathian = createRathianInstance("stabletech-factory-quest", 19, 189);
      game.unsetVariable("rathianGoingToDumps");
      rathian.getScriptObject().state = 1;
    }
  }
}