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
