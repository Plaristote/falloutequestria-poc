import {CharacterBehaviour} from "../character.mjs";

const disappearDelay = 172800;

export class HelpfulCopain extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }

  get dialog() {
    return "junkville/helpful-copain";
  }

  initialize() {
    console.log("HELPFULL COPAIN DISAPPEARING IN", 172800);
    this.model.tasks.addTask("prepareDisappear", disappearDelay * 1000, 1)
  }

  prepareDisappear() {
    console.log("HELPFUL COPAIN Prepare disappear", game.timeManager.getTimestamp(), level.getVariable("lastVisit"));
    if (game.timeManager.getTimestamp() - level.getVariable("lastVisit") >= disappearDelay)
      this.model.tasks.addTask("delayedDisappear", 1000, 1);
  }

  delayedDisappear() {
    console.log("HELPFUL COPAIN disappear");
    this.model.setVariable("disappeared", 1);
    this.model.setVariable("disappearedAt", game.timeManager.getTimestamp());
    game.uniqueCharacterStorage.saveCharacterFromCurrentLevel(this.model);
  }
}
