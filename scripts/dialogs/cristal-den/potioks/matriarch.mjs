import {
  canWarnPotioksAboutBibin,
  sabotageReportedToMatriarch,
  bibinSabotageReportedToMatriarch,
  wasSaboteurInterrogatedByBibin
} from "../../../quests/hillburrow/sabotage.mjs";
import {skillContest} from "../../../cmap/helpers/checks.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    let entryPoint = "intrusion";

    if (this.dialog.npc.hasVariable("sabotagePrompt")) {
      this.dialog.npc.unsetVariable("sabotagePrompt");
      entryPoint = "sabotage/entry";
    } else if (this.dialog.npc.hasVariable("met")) {
      entryPoint = "prompt";
    }
    this.dialog.npc.setVariable("met", 1);
    return entryPoint;
  }

  wasSentByBitty() {
    return canWarnPotioksAboutBibin();
  }

  wasSentByBibin() {
    return false;
  }

  get sneakJobReward() {
    return this.dialog.npc.getVariable("sneakJobReward", 500);
  }

  set sneakJobReward(value) {
    this.dialog.npc.setVariable("sneakJobReward", value);
  }

  get sneakJobIntroduced() {
    return this.dialog.npc.getVariable("toldAboutSpyJob", 0) == 1;
  }

  set sneakJobIntroduced(value) {
    this.dialog.npc.setVariable("toldAboutSpyJob", value ? 1 : 0);
  }

  sneakJobIntroduce() {
    this.sneakJobIntroduced = true;
  }

  sneakJobCanNegociateReward() {
    return this.sneakJobReward < 750;
  }

  sneakJobNegociateReward() {
    if (skillContest(game.player, this.dialog.npc, "barter") == game.player) {
      this.sneakJobReward = 750;
      return "sneak-job/increase-reward";
    }
    return "sneak-job/reward-not-increased";
  }

  sneakJobAccepted() {
    game.quests.addQuest("potioks-spy");
  }

  sneakJobCanReenter() {
    return this.sneakJobIntroduced && !game.quests.hasQuest("potioks-spy");
  }

  sneakJobIsOngoing() {
    const quest = game.quests.getQuest("potioks-spy");
    return quest && quest.inProgress;
  }

  saboteurWasInterrogated() {
    return wasSaboteurInterrogatedByBibin();
  }

  saboteurToldAboutBibinInvolvement() {
    this.dialog.npc.setVariable("bibinInvolvedInSabotage", 1);
  }

  endSabotageReport() {
    sabotageReportedToMatriarch();
  }

  endSabotageReportWithBibinInvolvement() {
    bibinSabotageReportedToMatriarch();
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
