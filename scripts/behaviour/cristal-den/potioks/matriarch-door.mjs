import {VaultDoor} from "../../vault-door.mjs";
import {canGuardPreventInteraction} from "../../watchObject.mjs";

export class MatriarchDoor extends VaultDoor {
  get guard() {
    return level.findObject("bunker.secretary");
  }

  onUse(character) {
    const guard = this.guard;

    if (canGuardPreventInteraction(guard, character) &&
        character.getFactionName() != "potioks") {
      if (character == game.player && guard.script.accessGranted) {
        return false;
      }
      level.addTextBubble(guard, i18n.t("cristal-den.potioks.cant-enter-matriarch-office"), 5000, "yellow");
      return true;
    }
    return false;
  }
}
