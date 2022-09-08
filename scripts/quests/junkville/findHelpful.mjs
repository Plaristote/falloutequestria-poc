import {QuestHelper} from "../helpers.mjs";

export function helpfulHasDisappeared() {
  if (!game.hasVariable("helpfulDead")) {
    const character = game.uniqueCharacterStorage.getCharacter("helpful-copain");
    return character && character.hasVariable("disappearedAt");
  }
  return true;
}

export function isHelpfulQuestAvailable() {
  return !game.quests.getQuest("junkville/findHelpful") && helpfulHasDisappeared();
}

export class FindHelpful {
  initialize() {
    this.model.location = "junkville";
  }

  get xpReward() {
    if (this.isObjectiveCompleted("save-helpful"))
      return 1800;
    return 1000;
  }

  getObjectives() {
    const objectives = [];

    objectives.push({
      label: this.tr("talk-to-parents"),
      success: this.isObjectiveCompleted("talk-to-parents")
    });
    objectives.push({
      label: this.tr("find-helpful"),
      success: this.isObjectiveCompleted("find-helpful")
    });
  }
}
