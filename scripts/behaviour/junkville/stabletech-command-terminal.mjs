export class StabletechCommandTerminal {
  constructor(model) {
    this.model = model;
    this.sprite = "monitor-left";
    this.dialog = "junkville-stabletech-terminal";
  }

  initialize() {
    if (this.model.path === "generator-room.terminal")
      this.enabled = true;
  }

  get enabled() {
    return this.model.getVariable("enabled") || false;
  }

  set enabled(val) {
    this.model.setVariable("enabled", val);
    this.model.setAnimation(`${this.sprite}-${val ? 'on' : 'off'}`);
  }

  getAvailableInteractions() {
    if (this.enabled)
      return ["use", "look"];
    return ["look"];
  }

  onUse(user) {
    if (user === level.player) {
      if (this.model.hasVariable("locked"))
        game.appendToConsole(i18n.t("messages.nothing-happens"));
      else
        level.initializeDialog(this.model, this.dialog);
    }
  }
}
