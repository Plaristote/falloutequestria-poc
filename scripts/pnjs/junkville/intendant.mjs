import {CharacterBehaviour} from "../character.mjs";

export class Intendant extends CharacterBehaviour {
  constructor(model) {
    super(model);
    this.dialog = "junkville/intendant";
  }
}
