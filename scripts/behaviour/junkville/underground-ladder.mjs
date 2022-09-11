import {
  helpfulHasDisappeared,
  helpfulExitCavernHook
} from "../../quests/junkville/findHelpful.mjs";

export class UndergroundLadder {
  constructor(model) {
    this.model = model;
  }
  
  getAvailableInteractions() {
    return ["use", "look"];
  }

  onUse() {
    game.switchToLevel("junkville-dumps", "from-underground");
    helpfulExitCavernHook();
  }
}
