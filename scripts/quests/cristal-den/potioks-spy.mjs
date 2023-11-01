import {QuestHelper} from "../helpers.mjs";

const questName = "cristal-den/potioks-spy";

export class PotioksSpy extends QuestHelper {
  initialize() {
    this.model.location = "cristal-den";
    this.model.addObjective("findSpy", this.tr("findSpy"));
  }

  onSuccess() {
    super.onSuccess();
    game.dataEngine.addReputation("potioks", 38);
  }
}
