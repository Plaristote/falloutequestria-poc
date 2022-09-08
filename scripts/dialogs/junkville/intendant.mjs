import {DialogHelper} from "../helpers.mjs";

class Dialog extends DialogHelper {
  constructor(dialog) {
    super(dialog);
  }
  
  getEntryPoint() {
    if (!this.dialog.npc.hasVariable("met")) {
      this.dialog.npc.setVariable("met", true);
      return "introduction";
    }
    return "entry";
  }

  entry() {
    if (!this.dialog.npc.hasVariable("knowsName"))
      return this.dialog.t("entry", { name: this.dialog.t("customer") });
  }

  learnPlayerName() {
    this.dialog.npc.setVariable("knowsName", true);
  }
  
  learnAboutLeader() {
    if (game.hasVariable("junkvilleCookDied"))
      return this.dialog.t("about-leader-dead");
    level.setVariable("intendantToldAboutLeader", true);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
