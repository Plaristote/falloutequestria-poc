import {AutoClosingDoor} from "../door-auto-close.mjs";

function isAuthorized(character) {
  return character.parent && (character.parent.name === "slave-guards" || character.parent.name === "slaves") || character.characterSheet == "hillburrow/rainy-potiok";
}

export class SlavePenDoor extends AutoClosingDoor {
  canGoThrough(model) {
    return isAuthorized(model) || super.canGoThrough(model);
  }

  onUse(model) {
    super.onUse(model);
    if (isAuthorized(model)) {
      this.model.opened = true;
      return true;
    }
    return false;
  }
}

