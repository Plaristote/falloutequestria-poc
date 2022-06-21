class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    switch (worldmap.getCurrentCity().name) {
    case "junkville":
      return "arrival";
    case "stable-103":
      game.setVariable("rathian-knows-stable-location", true);
      return "arrival-at-stable";
    default:
      return "arrival-elswhere";
    }
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
