import {QuestFlags, requireQuest} from "../../quests/helpers.mjs";
import * as Checks from "../../cmap/helpers/checks.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  get sabotageQuest() {
    return game.quests.getQuest("hillburrow/sabotage");
  }

  dynamiteHasBeenFound() {
    const quest = requireQuest("hillburrow/sabotage", QuestFlags.HiddenQuest);
    return quest.isObjectiveCompleted("findWaterCarrierDynamite");
  }

  canAskAboutSabotage() {
    return this.sabotageQuest && !this.sabotageQuest.hidden;
  }

  intimidationAttempt() {
    const winner = Checks.skillContest(game.player, this.dialog.npc, "strength", 3);

    return `sabotage-intimidation-${winner == game.player ? "success" : "fail"}`;
  }

  canConvinceToConfess() {
    return this.dialog.player.statistics.speech >= 89;
  }

  findOutDynamiteFromNpc() {
    const quest = game.quests.addQuest("hillburrow/sabotage", QuestFlags.HiddenQuest);
    quest.completeObjective("findSuspect");
  }

  onConfessionHeard() {
    this.sabotageQuest.script.onWaterCarrierConfessed();
  }

  onLearnAboutBibinInvolvment() {
    this.sabotageQuest.setVariable("bibinFoundOut", 1);
  }

  startFight() {
    this.sabotageQuest.setVariable("foughtHobo", 1);
    this.dialog.npc.setAsEnemy(game.player);
  }

  takeToPotiokBoss() {
    this.sabotageQuest.script.startWaterCarrierScene();
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
