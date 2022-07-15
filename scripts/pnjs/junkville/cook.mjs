import {CharacterBehaviour} from "../character.mjs";

export class Cook extends CharacterBehaviour {
  constructor(model) {
    super(model);
    this.dialog = "junkville-cook";
  }

  onDied() {
    game.setVariable("junkvilleCookDied", 1);
  }
}
