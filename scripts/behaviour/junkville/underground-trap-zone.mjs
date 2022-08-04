export class UndergroundTrapZone {
  constructor(model) {
    this.model = model;
  }
  
  onZoneEntered(object) {
    if (object === game.player && !this.model.hasVariable("triggered")) {
      this.model.setVariable("triggered", 1);
      game.appendToConsole(
        i18n.t("junkville.dumps-dog-hole-heard")
      );
    }
  }
}
