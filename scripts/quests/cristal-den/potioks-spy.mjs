import {QuestHelper, QuestFlags, requireQuest} from "../helpers.mjs";

const questName = "cristal-den/potioks-spy";

export function hasPotiokSpyQuest() {
  return game.quests.hasQuest(questName);
}

export function onFoundPotiokSpy() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  quest.completeObjective("findSpy");
}

export function onLearnedAboutPotiokSpyConfession() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  quest.addObjective("learnAboutConfession", quest.script.tr("learnAboutConfession"));
  quest.completeObjective("learnAboutConfession");
}

export function onLearnedAboutSavageConnection() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  quest.addObjective("learnAboutSavageConnection", quest.script.tr("learnAboutSavageConnection"));
  quest.completeObjective("learnAboutSavageConnection");
}

export function learnedAboutPotiokSpyConfession() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  return quest.isObjectiveComplete("learnAboutConfession");
}

export class PotioksSpy extends QuestHelper {
  initialize() {
    this.model.location = "cristal-den";
    this.model.addObjective("findSpy", this.tr("findSpy"));
  }

  get xpReward() {
    let base = 2000;

    if (this.model.isObjectiveCompleted("learnAboutConfession"))
      base += 275;
    if (this.model.isObjectiveCompleted("learnAboutSavageConnection"))
      base += 275;
    return base;
  }

  completeObjective(name) {
    switch (name) {
      case "findSpy":
        this.model.addObjective("solveSpy", this.tr("solveSpy"));
        break ;
      case "solveSpy":
        this.model.addObjective("report", this.tr("report"));
        break ;
      case "report":
        this.model.completed = true;
        break ;
    }
  }

  onSuccess() {
    super.onSuccess();
    game.dataEngine.addReputation("potioks", 38);
  }

  onCharacterKilled(character) {
    if (character.characterSheet === "cristal-den/bibins/potiok-spy")
      this.onKilledSpy();
  }

  onKilledSpy() {
    if (this.model.hasObjective("solveSpy")) {
      this.model.completeObjective("solveSpy");
      this.model.setVariable("killedSpy", 1);
    }
  }
}
