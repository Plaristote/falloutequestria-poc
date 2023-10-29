import {Door} from "../../door.mjs";

export class RanchBackdoor extends Door {
  constructor(model) {
    super(model);
  }

  get guard() {
    return level.findObject("ranch.entrance.steward");
  }

  onUse(character) {
    const guard = this.guard;

    if (guard && guard.isAlive() && guard.fieldOfView.isDetected(character) && !guard.isEnemy(character) && character.getFactionName() != "potioks") {
      if (character == game.player) {
        if (level.getVariable("access") > 1)
          return false;
        level.addTextBubble(guard, i18n.t("cristal-den.potioks.cant-enter-bunker"), 5000, "yellow");
      }
      return true;
    }
    return false;
  }
}
