import {QuestHelper} from "../helpers.mjs";

const questName = "cristal-den/slavers-errand";

export class SlaversErrand extends QuestHelper {
  initialize() {
    this.model.location = "cristal-den";
    this.model.addObjective("fetchSlaves", this.tr("fetchSlaves"));
  }

  completeObjective(name, completed) {
    if (completed) {
      if (name == "fetchSlaves")
        this.model.addObjective("reportToBittyPotiok", this.tr("reportToBittyPotiok"));
      else if (name == "reportToBittyPotiok")
        this.model.completed = true;
    }
  }

  onSuccess() {
    super.onSuccess();
    game.dataEngine.addReputation("potioks", 25);
  }
}
