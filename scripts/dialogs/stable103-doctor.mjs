class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }
  
  getEntryPoint() {
    if (!this.dialog.npc.hasVariable("met")) {
      this.dialog.npc.setVariable("met", true);
      this.introduction = true;
      return "mainQuest";
    }
    if (!this.dialog.npc.hasVariable("mainQuestDone") && game.getScriptObject().isMainQuestDone()) {
      return "mainQuest";
    }
    return "entryPoint";
  }

  hasCelestialDevice() {
    return false;
  }

  entryPoint() {
    if (this.introductionAnswer)
      return this.dialog.t(this.introductionAnswer);
  }
  
  mainQuestQuestion() {
    if (this.introduction)
      return this.dialog.t("introduction");
  }
  
  onAngry() {
    this.dialog.mood = "angry";
  }

  onMainQuestDone() {
    this.dialog.npc.setVariable("mainQuestDone", true);
  }
  
  onQuestDoneReassuring() {
    this.introductionAnswer = "introductionQuestReassuring";
  }
  
  onQuestDoneWorrying() {
    this.introductionAnswer = "introductionQuestWorrying";
  }
  
  onMainQuestNotDone() {
    this.introductionAnswer = "introductionQuestNotDone";
  }
  
  heal() {
    if (game.player.statistics.hitPoints < game.player.statistics.maxHitPoints) {
      game.asyncAdvanceTime(60);
      game.player.statistics.hitPoints = game.player.statistics.maxHitPoints;
      return "healedWounds";
    }
    return "nothingToHeal";
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
