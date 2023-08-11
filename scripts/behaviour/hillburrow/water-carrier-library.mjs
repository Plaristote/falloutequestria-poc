import {QuestFlags, requireQuest} from "../../quests/helpers.mjs";

export class WaterCarrierLibrary {
  constructor(model) {
    this.model = model;
  }

  onInspectInventory() {
    const quest = requireQuest("hillburrow/sabotage", QuestFlags.HiddenQuest);
    quest.script.onFoundWaterCarrierDynamite();
    return true;
  }
}
