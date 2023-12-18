import {canWarnPotioksAboutBibin} from "../../../quests/hillburrow/sabotage.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  wasSentByBitty() {
    return canWarnPotioksAboutBibin();
  }

  matriarchWillReceiveAboutBitty() {
    const character = game.getCharacter("cristal-den/potioks/matriarch");

    console.log("WHAT THE ACTUAL FUCK", character);
    if (!character || !character.isAlive())
      return "on-matriarch-dead";
    character.setVariable("sabotagePrompt", 1);
    this.dialog.npc.script.accessGranted = true;
    return "on-sent-by-bitty";
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
