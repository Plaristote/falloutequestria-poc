import {CharacterBehaviour} from "../character.mjs";

export class BibinBoxManager extends CharacterBehaviour {
  constructor(model) {
    super(model);
    this.dialog = "cristal-den/boxing-manager";
  }
}
