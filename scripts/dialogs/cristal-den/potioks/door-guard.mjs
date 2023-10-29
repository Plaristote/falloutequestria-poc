import {canWarnPotioksAboutBibin} from "../../../quests/hillburrow/sabotage.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    if (level.getVariable("access", 0) > 0)
      return "prompt-with-access";
    return "prompt";
  }

  wasSentByBitty() {
    return canWarnPotioksAboutBibin();
  }

  giveFullAccess() {
    level.setVariable("access", 2);
  }

  giveWorkAccess() {
    if (level.getVariable("access", 0) == 0)
      level.setVariable("access", 1);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
