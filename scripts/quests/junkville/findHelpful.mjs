import {QuestHelper} from "../helpers.mjs";

export function helpfulHasDisappeared() {
  if (!game.hasVariable("helpfulDead")) {
    const character = game.getCharacter("helpful-copain");
    return character && character.hasVariable("disappearedAt");
  }
  return true;
}

export function isHelpfulQuestAvailable() {
  return !game.quests.getQuest("junkville/findHelpful") && helpfulHasDisappeared();
}

export class FindHelpful extends QuestHelper {
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
    if (this.isObjectiveCompleted("find-helpful")) {
      objectives.push({
        label: this.tr("save-helpful"),
        success: this.isObjectiveCompleted("save-helpful"),
        failure: this.model.hasVariable("died")
      });
    }
    if (this.model.hasVariable("died")) {
      objectives.push({
        label: this.tr("tell-parents"),
        success: this.isObjectiveCompleted("tell-parents")
      });
    }
    return objectives;
  }

  completeObjective(objective) {
    super.completeObjective(objective);
    switch (objective) {
      case "save-helpful":
      case "tell-parents":
        this.model.completed = true;
        break ;
    }
  }
}
