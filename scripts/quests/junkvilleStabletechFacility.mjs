import {QuestHelper, requireQuest} from "./helpers.mjs";

const questName = "junkvilleStabletechFacility";

function hasQuest() { return game.quests.hasQuest(questName); }
function getQuest() { return game.quests.getQuest(questName); }

export function isFacilityQuestAvailable() {
  return !hasQuest() || getQuest().getScriptObject().isObjectiveCompleted("enter-facility");
}

export class JunkvilleStabletechFacility extends QuestHelper {
  initialize() {
    this.model.location = "junkville";
  }

  get xpReward() { return 2500; }

  onItemPicked(item) {
    if (item.itemType === "celestial-device-blueprints") {
      this.model.completeObjective("explore-facility");
      this.model.completeObjective("find-blueprints");
      this.model.completed = true;
    }
  }

  getObjectives() {
    const objectives = [];

    objectives.push({
      label: this.tr("enter-facility"),
      success: this.isObjectiveCompleted("enter-facility")
    });
    objectives.push({
      label: this.tr("explore-facility"),
      success: this.isObjectiveCompleted("explore-facility")
    });
    if (this.isObjectiveCompleted("explore-facility")) {
      objectives.push({
        label: this.tr("find-blueprints"),
        success: this.isObjectiveCompleted("find-blueprints")
      });
    }
    return objectives;
  }
}