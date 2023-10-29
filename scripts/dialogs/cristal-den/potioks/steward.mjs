class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  onPassingThrough() {
    if (level.getVariable("access", 0) > 1)
      return "send-away";
    return "";
  }

  canAskForWork() {
    return false;
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
