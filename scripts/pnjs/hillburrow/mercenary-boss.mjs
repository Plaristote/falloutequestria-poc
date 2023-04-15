import {CharacterBehaviour} from "../character.mjs";

class MercenaryBoss extends CharacterBehaviour {
  constructor(model) {
    super(model);
    this.dialog = "hillburrow/mercenary-boss";
  }
}

export function create(model) {
  return new MercenaryBoss(model);
}
