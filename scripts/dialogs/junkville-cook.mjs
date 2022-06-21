import {DialogHelper} from "./helpers.mjs";

class Dialog extends DialogHelper {
  constructor(dialog) {
    super(dialog);
  }

  getEntryPoint() {
    return "entry";
  }
  
  introduction() {
    if (!this.dialog.npc.hasVariable("met")) {
      this.dialog.npc.setVariable("met", true);
      return this.dialog.t("introduction");
    }
  }
  
  intendantToldAboutLeader() {
    return level.hasVariable("intendantToldAboutLeader");
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
