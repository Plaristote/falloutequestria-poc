class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }
  
  sendToPen() {
    game.playerParty.insertIntoZone(level, "pony-pen");
  }

  startCombat() {
    this.dialog.npc.setAsEnemy(game.player);
    level.joinCombat(game.player);
    level.joinCombat(this.dialog.npc);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
