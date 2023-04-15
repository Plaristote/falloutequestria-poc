import {QuestHelper} from "../helpers.mjs";

const questName = "hillburrow/oldSheriffMurder";

export function initializeOldSheriffMurderQuest() {
  game.quests.addQuest(questName);
}

export function hasOldSheriffMurderQuest() {
  return game.quests.hasQuest(questName);
}

export function hasActiveOldSheriffMurderQuest() {
  return hasOldSheriffMurderQuest() && game.quests.getQuest(questName).inProgress;
}

export class OldSheriffMurder extends QuestHelper {
  initialize() {
    this.model.location = "hillburrow";
  }

  getObjectives() {
    return [
      { label: this.tr("solve-murder"), success: this.isObjectiveCompleted("solveMurder") },
      { label: this.tr("talk-to-doctor"), success: this.isObjectiveCompleted("talkToDoctor") }
    ];
  }
}
