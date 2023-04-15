import {CharacterBehaviour} from "../character.mjs";

export class CaravanLeader extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }

  get dialog() {
    return "cristal-den/caravan-leader";
  }
}
