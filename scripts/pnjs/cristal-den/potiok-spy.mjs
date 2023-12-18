import {CharacterBehaviour} from "./../character.mjs";

class PotiokSpy extends CharacterBehaviour {
  constructor(model) {
    super(model);
    this.dialog = "cristal-den/bibins/potiok-spy";
  }
}

export function create(model) {
  return new PotiokSpy(model);
}
