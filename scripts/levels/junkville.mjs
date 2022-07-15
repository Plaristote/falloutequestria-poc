import {LevelBase} from "./base.mjs";
import {rathianTemplate} from "../pnjs/rathian/template.mjs";

function prepareRathian() {
  console.log("prepareRathian");
  const group = game.createNpcGroup({ name: "Rathian", members: [rathianTemplate] });
  const rathian = group.list[0];
  rathian.setScript("rathian/junkville.mjs");
  level.appendObject(rathian);
  level.setCharacterPosition(rathian, 53, 27);
}

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
      prepareRathian();
  }

  goToUndergroundBattle() {
    game.switchToLevel("junkville-underground", "battle-entry");
  }

  onLoaded() {
    if (game.hasVariable("junkvilleBattleCookDied"))
      removeCook();
  }
}

export function create(model) {
  return new Level(model);
}
