class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  onAcceptedCaravanWork() {
    game.setVariable("fargo-caravan-on", 1);
  }

  acceptNegociatorQuest() {
    // TODO implement negociator quest entry hook
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
