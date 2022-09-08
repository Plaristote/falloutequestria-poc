import {CharacterBehaviour} from "../character.mjs";
import {helpfulHasDisappeared} from "../../quests/junkville/findHelpful.mjs";
import {greetingsBubbles} from "./helpful-dad.mjs";

export class HelpfulMom extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }

  get textBubbles() {
    return greetingsBubbles;
  }

  get dialog() {
    return helpfulHasDisappeared() ? "junkville/helpful-mom-quest" : null;
  }
}
