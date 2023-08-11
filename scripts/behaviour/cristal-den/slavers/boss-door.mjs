import {Door} from "../../door.mjs";

export class BossDoor extends Door {
  constructor(model) {
    super(model);
  }

  get guard() {
    return level.findObject("slavers-den.guards.guard#4");
  }

  onUse(character) {
    const guard = this.guard;

    if (guard && guard.isAlive() && !level.isInCombat(guard) && character.getFactionName() != "cristal-den-slaves") {
      if (character == game.player) {
        if (game.hasVariable("cristalDenSlavers.canSeeBoss"))
          return false;
        level.addTextBubble(guard, i18n.t("cristal-den.slavers.cant-go-to-boss"), 5000, "yellow");
      }
      return true;
    }
    return false;
  }
}
