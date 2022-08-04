import {LevelBase} from "./base.mjs";
import {createRathianInstance, getRathian} from "../pnjs/rathian/template.mjs";
import {requireQuest} from "../quests/helpers.mjs";

const faction = "stabletech-facility";

export class JunkvilleStabletechFacility extends LevelBase {
  initialize() {
    game.diplomacy.addFaction(faction);
    this.setSecurityEnabled(true);
    this.guards.forEach(guard => { guard.statistics.faction = faction; });
  }

  onLoaded() {
    const quest = requireQuest("junkvilleStabletechFacility");

    if (game.getVariable("rathianGoingToStabletechFacility") === 1) {
      const rathian = createRathianInstance("stabletech-factory-quest", 29, 25);
      game.unsetVariable("rathianGoingToStabletechFacility");
      rathian.getScriptObject().state = 4;
    }
    quest.completeObjective("enter-facility");
  }

  setSecurityEnabled(value) {
    game.diplomacy.setAsEnemy(value, faction, "player");
  }

  isSecurityEnabled() {
    return game.diplomacy.areEnemies(faction, "player");
  }

  get guards() {
    const object = level.findGroup("security-room").objects;
    const result = [];

    for (let i = 0 ; i < object.length ; ++i) {
      if (object[i].getObjectType() === "Character" && object[i].isAlive())
        result.push(object[i]);
    }
    return result;
  }
}

export function create(model) {
  return new JunkvilleStabletechFacility(model);
}