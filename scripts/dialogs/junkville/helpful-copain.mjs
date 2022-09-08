class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    this.dialog.mood = "smile";
    return this.dialog.npc.hasVariable("met") ? "introduction" : "entry";
  }

  lowerReputation() {
    game.dataEngine.addReputation("junkville", -9);
  }

  joinPlayer() {
    this.dialog.npc.setScript("companion/helpful-copain.mjs");
    game.playerParty.addCharacter(this.dialog.npc);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
