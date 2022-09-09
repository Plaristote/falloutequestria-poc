import {CharacterBehaviour} from "../character.mjs";
import {helpfulHasDisappeared} from "../../quests/junkville/findHelpful.mjs";
import {greetingsBubbles} from "./helpful-dad.mjs";
import {HelpfulReturnScene} from "../../scenes/junkville/helpfulReturn.mjs";

function broughtBackHelpful() {
  return game.playerParty.find(character => character.characterSheet == "helpful-copain") != null;
}

export class HelpfulMom extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }

  get textBubbles() {
    return greetingsBubbles;
  }

  get dialog() {
    return helpfulHasDisappeared() && !broughtBackHelpful() ? "junkville/helpful-mom-quest" : null;
  }

  broughtBackHelpful() {
    const helpful = game.playerParty.findCharacter(character => character.characterSheet == "helpful-copain");
    return helpful != null;
  }

  onCharacterDetected(character) {
    if (helpfulHasDisappeared() && character.characterSheet == "helpful-copain" && !this.sceneManager) {
      this.scene = new HelpfulReturnScene(this);
      this.scene.initialize();
    }
    super.onCharacterDetected(character);
  }
}
