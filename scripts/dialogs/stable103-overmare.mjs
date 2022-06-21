class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  canReportJunkvilleTrail() {
    return !this.dialog.npc.hasVariable("reportedJunkvilleTrail") && worldmap.discoveredCities.indexOf("junkville") >= 0;
  }

  reportJunkville() {
    this.dialog.npc.setVariable("reportedJunkvilleTrail", true);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
