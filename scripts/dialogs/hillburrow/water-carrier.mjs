import {QuestFlags, requireQuest} from "../../quests/helpers.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  dynamiteHasBeenFound() {
    const quest = requireQuest("hillburrow/mineSabotage", QuestFlags.HiddenQuest);
    return quest.hasVariable("foundDynamite");
  }

  canAskAboutSabotage() {
    const quest = game.quests.getQuest("hillburrow/mineSabotage");
    return quest && !quest.hidden;
  }

  intimidationAttempt() {
    return "sabotage-intimidation-fail";
  }

  canConvinceToConfess() {
    return this.dialog.player.statistics.speech >= 89;
  }

  findOutDynamiteFromNpc() {
    const quest = requireQuest("hillburrow/mineSabotage", QuestFlags.HiddenQuest);
    quest.completeObjective("findSuspect");
  }

  onConfessionHeard() {
    const quest = requireQuest("hillburrow/mineSabotage");
    quest.completeObjective("getConfession");
  }

  onLearnAboutBibinInvolvment() {
    const quest = requireQuest("hillburrow/mineSabotage");
    quest.completeObjective("binbinFoundOut");
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
