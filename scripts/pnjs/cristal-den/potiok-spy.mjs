import {CharacterBehaviour} from "./../character.mjs";

class PotiokSpy extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }
}

export function create(model) {
  return new PotiokSpy(model);
}