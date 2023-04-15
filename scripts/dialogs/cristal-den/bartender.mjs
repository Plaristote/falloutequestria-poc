class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    if (this.npc.hasVariable("talked"))
      return "entry";
    this.npc.setVariable("talked", 1);
    return "meeting";
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
