import {getValueFromRange} from "../random.mjs";

export class UndergroundTrap {
  constructor(model) {
    this.model = model;
    this.triggered = 0;
  }

  initialize() {
    this.model.hidden = true;
  }

  onZoneEntered(object) {
    if (object === game.player && !this.triggered) {
      this.triggered++;
      this.model.hidden = false;
      game.setVariable("junkville-dog-hole", true);
      for (let i = 0 ; i < game.playerParty.list.length ; ++i) {
        const character = game.playerParty.list[i];
        const damage = Math.min(getValueFromRange(12, 16), character.statistics.hitPoints - 1);
        const resistance = character.statistics.endurance;
        character.takeDamage(Math.max(0, damage - resistance), null);
        character.addBuff("ko");
        game.appendToConsole(i18n.t("junkville.dumps-dog-hole-fell"));
      }
      game.switchToLevel("junkville-underground", "trap-entry");
    }
  }
}
