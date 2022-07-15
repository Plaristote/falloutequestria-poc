import {RandomEncounterComponent} from "./randomEncounters.mjs";
import {getValueFromRange} from "behaviour/random.mjs";

function contains(array, faction1, faction2) {
  return array.indexOf(faction1) >= 0 && array.indexOf(faction2) >= 0;
}

function mordinoHook(factions, hostility) {
  if (contains(factions, "mordino", "player") && hostility) {
    if (!game.quests.hasQuest("catch-mordino"))
      game.setFactionAsEnemy("city-sample", "player", true);
  }
  else if (contains(factions, "city-sample", "player") && hostility) {
    game.dataEngine.setFactionAsEnemy("mordino", "player");
    return true;
  }
  return false;
}

class Game extends RandomEncounterComponent {
  constructor(model) {
    super(model);
  }

  get rathianIntroduced() { return game.hasVariable("rathianIntroduced"); }
  set rathianIntroduced(value) { game.setVariable("rathianIntroduced", value); }

  diplomacyUpdate(factions, hostility) {
    if (mordinoHook(factions, hostility))
      return ;
  }

  enableEncounters() {
    console.log("NOW ENABLING ECOUERs");
    game.setVariable("enable-encounters", true);
  }

  randomEncounterTrigger() {
    if (game.getVariable("enable-encounters") === true) {
      if (this.rathianIntroduced)
        super.randomEncounterTrigger();
      else
        this.randomIntroduceRathian();
    } else {
      console.log("randomEncounterTrigger: encounters disabled");
    }
  }

  randomIntroduceRathian() {
    this.rathianIt = this.rathianIt ? this.rathianIt + 1 : 1;
    if (getValueFromRange(this.rathianIt, 10) >= 8)
      this.introduceRathian();
  }

  introduceRathian() {
    if (!game.worldmap.getCurrentCity()) {
      this.rathianIntroduced = true;
      game.worldmap.paused = true;
      game.setVariable("rathianIntroduced", true);
      game.randomEncounters.prepareEncounter("rathian-meeting", {
        "optional": false,
        "title": i18n.t("encounters.ambush"),
      });
    }
  }
  
  isMainQuestDone() {
    return false;
  }
}

export function create(model) {
  return new Game(model);
}
