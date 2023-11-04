import {requireQuest} from "../../quests/helpers.mjs";

class Dialog {
  constructor(dialog) {
    this.quest = requireQuest("junkville/findHelpful");
    this.dialog = dialog;
    this.ambiance = "cavern";
    game.loadingScreenBackground = "helpful_copain";
  }

  getEntryPoint() {
    if (this.dialog.npc.hasVariable("bodyIntroduction"))
      return "entry";
    this.dialog.npc.setVariable("bodyIntroduction", 1);
    return "introduction";
  }

  introduction() {
    this.quest.completeObjective("find-helpful");
    if (game.player.statistics.perception > 6)
      return this.dialog.tr("introduction-perceptive");
    return this.dialog.tr("introduction");
  }

  onIntroductionLeave() {
    this.dialog.npc.unsetVariable("bodyIntroduction");
  }

  onWoundsLeave() {
    if (!this.isAwake()) this.onIntroductionLeave();
  }

  onIntroductionExamine() {
    if (game.player.statistics.perception <= 6)
      return "introduction-alive";
    return "examine-wounds";
  }

  entry() {
    if (this.dialog.npc.hasVariable("nameGiven"))
      return this.dialog.t("entry-with-name");
    return this.dialog.t("entry");
  }

  examineWounds() {
    if (game.player.statistics.medicine >= 45) {
      return this.dialog.t("examine-wounds");
    }
    return this.dialog.t("examine-wounds-fail")
  }

  canBuildSlint() {
    return game.player.statistics.medicine >= 45;
  }

  craftSlint() {
    this.dialog.npc.setVariable("slint-crafted", 1);
  }

  canLookForWounds() {
    return !this.dialog.npc.hasVariable("slint-crafted");
  }

  wakeUp() {
    this.dialog.npc.setVariable("wokeUp", 1);
  }

  isAwake() {
    return this.dialog.npc.hasVariable("wokeUp");
  }

  isSleeping() {
    return !this.isAwake();
  }

  onComeWithMe() {
    return this.dialog.npc.hasVariable("slint-crafted") ? "come" : "cannot-come";
  }

  joinPlayer() {
    game.playerParty.addCharacter(this.dialog.npc);
    this.dialog.npc.tasks.addTask("followPlayer", 3123, 0);
    this.dialog.npc.movementMode = "walking";
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
