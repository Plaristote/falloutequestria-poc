class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    if (this.dialog.npc.script.pendingReward)
      return "reward";
    else if (canJoinCaravanOnTheWayBack)
      return "way-back";
    return "entry";
  }

  get caravanDestination() {
    return this.dialog.npc.script.nextCaravanDestination;
  }

  canJoinCaravanOnTheWayBack() {
    return typeof level !== "undefined" && level.name !== "cristal-den-entrance";
  }

  canJoinCaravan() {
    return game.getVariable("fargo-caravan-on", 0) == 1;
  }

  onJoinCaravan() {
    return game.timeManager.weekDay == 1 ? "join-caravan" : "caravan-later";
  }

  startCaravan() {
    this.dialog.npc.tasks.addTask("startCaravan", 350, 1);
  }

  giveReward() {
    game.player.inventory.addItemOfType("bottlecaps", 200 * this.dialog.npc.script.pendingReward);
    this.dialog.npc.script.pendingReward = 0;
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
