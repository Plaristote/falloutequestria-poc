class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    if (!this.dialog.npc.hasVariable("met")) {
      this.dialog.npc.setVariable("met-junkville", true);
      this.dialog.npc.setVariable("met", true);
      return "entry-first-meeting";
    }
    return "entry";
  }

  entry() {
    if (this.alreadyEntered)
      return this.dialog.t("entry-more");
    this.alreadyEntered = true;
    if (!this.dialog.npc.hasVariable("met-junkville")) {
      this.dialog.npc.setVariable("met-junkville", true);
      return this.dialog.t("entry-alt");
    }
    return this.dialog.t("entry");
  }
  
  isDeviceQuestAvailable() {
    return true; // TODO
  }

  hasTalkedAboutDevice() {
    return this.dialog.npc.getVariable("talked-about-device") === true;
  }

  canInquireAboutDevice() {
    return !this.hasTalkedAboutDevice() && this.isDeviceQuestAvailable();
  }

  canAskAgainAboutDevice() {
    return this.hasTalkedAboutDevice() && this.isDeviceQuestAvailable();
  }
  
  askCelestialDeviceText() {
    return this.hasTalkedAboutDevice() ? this.dialog.t("ask-about-celestial-device") : this.dialog.t("ask-about-celestial-device-alt");
  }
  
  askedAboutCelestialDevice() {
    if (this.hasTalkedAboutDevice())
      return this.dialog.t("about-celestial-device-intro-alt");
    this.dialog.npc.setVariable("talked-about-device", true);
    return this.dialog.t("about-celestial-device-intro");
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
