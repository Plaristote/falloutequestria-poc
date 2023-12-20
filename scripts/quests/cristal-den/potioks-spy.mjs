import {QuestHelper, QuestFlags, requireQuest} from "../helpers.mjs";

const questName = "cristal-den/potioks-spy";

export function potiokSpyQuestStarted() {
  return game.quests.hasQuest(questName);
}

export function hasPotiokSpyQuest() {
  const quest = game.quests.getQuest(questName);

  return quest && !quest.hidden;
}

export function onFoundPotiokSpy() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  quest.completeObjective("findSpy");
}

export function foundPotiokSpy() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  return quest.isObjectiveCompleted("findSpy");
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

  return quest.isObjectiveCompleted("learnAboutConfession");
}

export function learnedAboutSavageConnection() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  return quest.isObjectiveCompleted("learnAboutSavageConnection");
}

export function onStartPotiokSpyEscape(spy) {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  spy.tasks.addTask("followPlayer", 2142, 0);
  game.playerParty.addCharacter(spy);
  quest.addObjective("escortSpy", quest.tr("escortSpy"));
}

export function onEndPotiokSpyEscape(spy) {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  level.addTextBubble(spy, quest.tr("thanks-for-escape"), 3000, "lightgreen");
  spy.tasks.removeTask("followPlayer");
  spy.script.delayedRemoval(3250);
  game.playerParty.removeCharacter(spy);
  quest.completeObjective("escortSpy");
}

export function onExitPotiokSpyEscape() {
  const quest = requireQuest(questName, QuestFlags.HiddenQuest);

  if (quest.hasObjective("escortSpy")) {
    const spy = level.findObject("hostel.cell-room.potiok-spy");

    if (!quest.isObjectiveCompleted("escortSpy")) {
      game.playerParty.removeCharacter(spy);
      quest.failObjective("escortSpy");
      quest.script.onSolvedSpyIssue();
    }
    level.deleteObject(spy);
  }
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
    if (this.model.isObjectiveCompleted("escortSpy"))
      base += 315;
    return base;
  }

  completeObjective(name) {
    switch (name) {
      case "findSpy":
        this.model.addObjective("solveSpy", this.tr("solveSpy"));
        break ;
      case "escortSpy":
        this.onSolvedSpyIssue();
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
    if (this.model.hasObjective("escortSpy"))
      this.model.failObjective("escortSpy");
    if (character.characterSheet === "cristal-den/bibins/potiok-spy")
      this.onKilledSpy();
  }

  onKilledSpy() {
    this.onSolvedSpyIssue();
    this.model.setVariable("killedSpy", 1);
  }

  onSolvedSpyIssue() {
    if (!this.model.hasObjective("solveSpy"))
      this.model.addObjective("solveSpy", this.tr("solveSpy"));
    this.model.completeObjective("solveSpy");
  }
}
