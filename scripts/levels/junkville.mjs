import {LevelBase} from "./base.mjs";
import {createRathianInstance, getRathian} from "../pnjs/rathian/template.mjs";

function removeCook() {
  const cook = level.findObject("inn.cook");

  if (cook)
    level.deleteObject(cook);
}

class Level extends LevelBase {
  constructor(model) {
    super(model);
    console.log("JUNKVILLE constructor");
  }
	
  initialize() {
    console.log("JUNKVILLE initialize");
    level.tasks.addTask("delayedInitialize", 1, 1);
  }

  delayedInitialize() {
    game.dataEngine.setFactionReputationEnabled("junkville", true);
    if (!level.hasVariable("rathianPrepared"))
      createRathianInstance("junkville", 53, 27);
  }

  goToUndergroundBattle() {
    game.switchToLevel("junkville-underground", "battle-entry");
  }

  onLoaded() {
    if (game.hasVariable("junkvilleBattleCookDied"))
      removeCook();
  }

  onExit() {
    if (game.getVariable("rathianGoingToDumps") === 1) {
      game.setVariable("rathianGoingToDumps", 2);
      level.deleteObject(getRathian());
    }
  }
}

export function create(model) {
  return new Level(model);
}
