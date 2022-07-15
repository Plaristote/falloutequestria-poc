import {requireQuest} from "../quests/helpers.mjs";
import {captiveReleaseAuthorized} from "../quests/junkvilleDumpsDisappeared.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  addQuest() {
    const object = requireQuest("junkvilleDumpsDisappeared");
    if (!this.wasSentByJunkville())
      object.setVariable("initBy", this.dialog.npc.objectName);
    object.completeObjective("find-disappeared");
  }

  hasCaptiveQuest() {
    return game.quests.hasQuest("junkvilleDumpsDisappeared");
  }

  wasSentByJunkville() {
    if (this.hasCaptiveQuest()) {
      const object = requireQuest("junkvilleDumpsDisappeared");
      return object.getVariable("initBy") == "cook";
    }
    return false;
  }

  wasReleaseAccepted() { return captiveReleaseAuthorized(); }

  triggerGoToExit() {
    level.getScriptObject().sendCaptivesToExit();
  }
  
  onBreakout() {
    return "breakout-fail";
    return "breakout";
  }

  dogsEradicated() {
    const questName = "junkvilleNegociateWithDogs";
    if (game.quests.hasQuest(questName))
      return requireQuest(questName).getScriptObject().isObjectiveCompleted("win-battle");
    return false;
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
