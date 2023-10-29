import {Door} from "../../door.mjs";

export class RanchDoor extends Door {
  get guard() {
    return level.findObject("ranch.door-guard");
  }

  onUse(character) {
    const guard = this.guard;

    if (guard && guard.isAlive() && guard.fieldOfView.isDetected(character) && !guard.isEnemy(character) && character.getFactionName() != "potioks") {
      if (character == game.player) {
        if (level.getVariable("access") > 0)
          return false;
        level.addTextBubble(guard, i18n.t("cristal-den.potioks.cant-enter-ranch"), 5000, "yellow");
      }
      return true;
    }
    return false;
  }
}

