import {CharacterBehaviour} from "./character.mjs";

class MercenarySlaveGuard extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }
}

export function create(model) {
  return new MercenarySlaveGuard(model);
}