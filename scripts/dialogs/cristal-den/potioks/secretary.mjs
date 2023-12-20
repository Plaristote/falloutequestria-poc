import {canWarnPotioksAboutBibin} from "../../../quests/hillburrow/sabotage.mjs";
import {hasPotiokSpyQuest} from "../../../quests/cristal-den/potioks-spy.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  get matriarch() {
    return game.getCharacter("cristal-den/potioks/matriarch");
  }

  wasSentByBitty() {
    return canWarnPotioksAboutBibin();
  }

  matriarchWillReceiveAboutBitty() {
    const result = this.matriarchWillReceiveAboutJob();

    if (result != "on-matriarch-dead")
      this.matriarch.setVariable("sabotagePrompt", 1);
    this.dialog.npc.script.accessGranted = true;
    return "on-sent-by-bitty";
  }

  matriarchWillReceiveAboutJob() {
    if (!this.matriarch || !this.matriarch.isAlive())
      return "on-matriarch-dead";
    this.dialog.npc.script.accessGranted = true;
    return "on-sent-by-bitty";
  }

  hasMatriarchQuest() {
    return hasPotiokSpyQuest();
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
