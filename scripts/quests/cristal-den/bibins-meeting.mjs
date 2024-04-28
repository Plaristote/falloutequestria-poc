import {QuestHelper, QuestFlags, requireQuest} from "../helpers.mjs";

const questName = "cristal-den/bibins-meeting";

export function hasCaughtBibinAttention() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);
  return quest.isObjectiveCompleted("catchBibinAttention");
}

export function shouldWarnBibinWantsToSeePlayer() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  return hasCaughtBibinAttention() && !quest.failed && !quest.completed
     && !quest.isObjectiveCompleted("talkToBibin");
}

export function onCatchBibinAttention() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);
  quest.completeObjective("catchBibinAttention");
}

export class BibinsMeeting extends QuestHelper {
  constructor(model) {
    super(model);
    this.xpReward = 275;
  }

  initialize() {
    this.model.location = "cristal-den";
    this.model.addObjective("catchBibinAttention", this.tr("catchBibinAttention"));
    this.model.addObjective("talkToBibin", this.tr("talkToBibin"));
  }

  onCharacterKilled(character) {
    if (character.objectName == "bibin")
      this.model.failed = true;
  }

  completeObjective(name) {
    if (name == "talkToBibin")
      this.completed = true;
  }

  onSuccess() {
    game.dataEngine.addReputation("bibins-band", 50);
    super.onSuccess();
  }
}
