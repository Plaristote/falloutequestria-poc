import {hasActiveOldSheriffMurderQuest} from "../../quests/hillburrow/oldSheriffMurder.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  entryText() {
    if (this.dialog.npc.hasVariable("met"))
      return "entry";
    this.dialog.npc.setVariable("met", 1);
    return "entry-alt";
  }

  knowAboutFightingAbility() {
    return this.dialog.npc.hasVariable("enable-teaching");
  }

  toldBrawlStory() {
    this.dialog.npc.setVariable("enable-teaching", 1);
  }

  canTeachUnarmed() {
    return this.dialog.npc.statistics.unarmed > game.player.statistics.unarmed;
  }

  hasRecoveredFromLastLesson() {
    if (this.dialog.npc.hasVariable("last-teaching")) {
      const lastSession = this.dialog.npc.getVariable("last-teaching");
      return game.timeManager.getTimestamp() - lastSession > 60 * 60 * 24 * 2;
    }
    return true;
  }

  onAskTeaching() {
    if (!this.canTeachUnarmed())
      return "teach-fighting-over";
    if (!this.hasRecoveredFromLastLesson())
      return "teach-fighting-recover";
    return "teach-fighting";
  }

  startTraining() {
    const maxTraining = this.dialog.npc.statistics.unarmed - game.player.statistics.unarmed;
    const trainingValue = Math.min(10, maxTraining);

    game.appendToConsole(i18n.t("messages.training", { skill: i18n.t("cmap.unarmed"), amount: trainingValue }));
    game.player.statistics.unarmed += trainingValue;
    game.asyncAdvanceTime(240, () => {
      this.dialog.npc.setVariable("last-teaching", game.timeManager.getTimestamp());
    });
  }

  canBuyBeer() {
    return game.player.inventory.count("bottlecaps") > 6;
  }

  buyBeer() {
    game.dataEngine.addReputation("hillburrow", 2);
    game.player.inventory.removeItemOfType("bottlecaps", 6);
  }

  canAskAboutSheriffMurder() {
    const quest = game.quests.getQuest("hillburrow/oldSheriffMurder");
    return quest && quest.hasVariable("leadsDrunken");
  }

  onLearnAboutSheriffGoingAtBar() {
    const quest = game.quests.getQuest("hillburrow/oldSheriffMurder");
    quest.setVariable("knowsBarHabits", 1);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
